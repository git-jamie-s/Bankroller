Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  root "home#index"
  get "/accounts", to: "home#index"
  get "/accounts/*", to: "home#index"
  get "/budgets", to: "home#index"
  get "/rules", to: "home#index"
  post "/fileupload", to: "uploads#post"
end
