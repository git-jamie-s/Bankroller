# frozen_string_literal: true

require "ofx"

class UploadsController < ApplicationController
    def post
        begin
            if ofx_account_bank_id.blank?
                        fail("unable to determine bank identifiers")
                        return
            end
            if ofx_account_id.blank?
                fail("unable to determine account identifier")
                return
            end

            Rails.logger.info("[Upload] Bank Account: #{ofx_account_bank_id} #{ofx_account_id}")

            account = Account.find_by(bank_id: ofx_account_bank_id, bank_account_id: ofx_account_id)

            if account.nil?
                fail("unable to find bank account")
                return
            end

            trans = transactions(account)
            transaction_count = trans.size
            Rails.logger.info("Read #{transaction_count} transactions")

            trans = filter(trans)

            cat_count = categorize(trans)
            Rails.logger.info("Categorized #{cat_count} transactions")

            write_transactions(trans)
            Rails.logger.info("Wrote #{trans.count} transactions")

            response = {
                status: "success",
                account_id: account.id,
                account_name: account.account_name,
                link: "/accounts/#{account.id}",
                transactions: transaction_count,
                categorized: cat_count,
                saved: trans.count
            }
            render(json: response.to_json)
        rescue => e
            response = {
                status: "failed",
                message: "Error processing file: #{e.message}"
            }
            render(json: response.to_json)
        end
    end

    def filter(transactions)
        tids = transactions.pluck(:id)
        existing = Transaction.where(id: tids).pluck(:id).to_set
        transactions.filter { |t| !existing.include?(t.id) }
    end


    def write_transactions(transactions)
        Transaction.transaction do
            transactions.each do |transaction|
                transaction.save
            end
        end
        transactions
    end

    def transactions(account)
        Rails.logger.info("Processing Transactions")

        balance = ofx.account.balance.amount_in_pennies

        transactions = []

        ofx.account.transactions.each do |t|
            memo = t.memo
            unless memo.nil?
                memo = memo.gsub("&amp;", "&")
                            .gsub("&lt;", "<")
                            .gsub("&gt;", ">")
            end

            description = t.name
            unless description.nil?
                description = description.gsub("&amp;", "&")
                    .gsub("&lt;", "<")
                    .gsub("&gt;", ">")
            end
            if description.blank?
                description = memo
            end

            if description.starts_with?("INTERAC E-TRANSFER") && memo.starts_with?("EMTS;INTERAC E-TRANSFER")
                description = memo[5..]
            end

            bank_transaction_id = t.fit_id
            balance += t.amount_in_pennies
            transactions << Transaction.new(
                id: bank_transaction_id,
                account:,
                memo:,
                description:,
                balance:,
                amount: t.amount_in_pennies,
                transaction_type: t.type.to_s.upcase,
                cheque_number: t.check_number,
                date: t.posted_at,
                provisional: false
            )
        end

        transactions
    end

    def categorize(transactions)
        count = 0

        auto_transactions = AutoTransaction.all.to_a

        transactions.each do |t|
            best_match = nil
            auto_transactions.each do |auto_transaction|
                match_weight = auto_transaction.match?(t)
                if match_weight.present?
                    best_match = auto_transaction if best_match.nil? || match_weight > best_match.match_weight
                end
            end
            if best_match.present?
                Rails.logger.info("Categorizing #{t.description} -> #{best_match.category_id}")
                t.category_id = best_match.category_id
                count += 1
            end
        end
        count
    end

    private

    def ofx
        @ofx ||= OFX(params[:ofxfile].read)
    end

    def ofx_account_bank_id
        @account_bank_id ||= begin
            org = ofx.sign_on.fi_name
            fi = ofx.sign_on.fi_id
            bank_id = ofx.account.bank_id

            ids = []
            ids << org if org.present?
            ids << fi if fi.present?
            ids << bank_id if bank_id.present?

            ids.join("-")
         end
    end

    def ofx_account_id
        @account_id ||= ofx.account.id
    end

    def fail(message)
        response = { status: "failed", message: }
        render(json: response.to_json)
    end
end
