import React from "react";
import { Button, Card, DropZone, Link, List, Modal, ProgressBar, Text } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'

interface UploadResponse {
    status: string;
    message?: string;
    account_id?: number;
    account_name?: string;
    account_new?: boolean;
    link?: string;
    transactions?: number;
    categorized?: number;
    saved?: number;
    progress: number;
};

interface Props {
    reload: (account_id: number | null) => void;
}

export const UploadThing: React.FC<Props> = ({ reload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [started, setStarted] = useState<boolean>(false);
    const [status, setStatus] = useState<UploadResponse | null>(null);
    const navigate = useNavigate()

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
            setFile(acceptedFiles[0]),
        [],
    );

    const fileUpload = !file && <DropZone.FileUpload />;

    if (file && !started) {
        const csrfToken = document.querySelector('meta[name=csrf-token]')?.getAttribute('content') || '';

        setStarted(true);

        setStatus({ status: "Upload started", message: "", progress: 50 });
        setStatus(null);

        const formData = new FormData();
        formData.append('ofxfile', file);

        // You can write the URL of your server or any other endpoint used for file upload
        fetch('/fileupload', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRF-Token': csrfToken }
        }).then(async (data) => {
            if (data.status === 200) {
                const result = await data.json();
                setStatus(result as UploadResponse);
                reload(result.account_id);
            } else {
                setStatus({ status: data.statusText, message: `Upload of ${file.name} failed`, progress: 0 });
                reload(null);
            }
        }).catch((e) => {
            setStatus({ status: "Upload failed", message: e.message, progress: 0 });
        });
    }

    const onClose = () => {
        setFile(null);
        setStarted(false);
    }

    const statusStuff = () => {

        if (status === null)
            return null;

        const listItems: any[] = [];

        if (status.transactions) {
            const skipped = status.transactions - status.saved!;
            if (status.account_new === true) {
                listItems.push(<List.Item>New Account Created: {status.account_name}</List.Item>);
            } else {
                listItems.push(<List.Item>Account: {status.account_name}</List.Item>);
            }
            listItems.push(<List.Item>{status.transactions} transactions processed.</List.Item>);
            listItems.push(<List.Item>{status.saved} transactions saved, {skipped} skipped</List.Item>);
            listItems.push(<List.Item>{status.categorized} transactions categorized</List.Item>);
        }

        return status && (
            <>
                <Text as="p">Status: {status.status}</Text>
                {status.message && (<Text as="p">{status.message}</Text>)}
                <List type="bullet">
                    {listItems}
                </List>
            </>
        )
    };

    const progress = status?.progress && <ProgressBar progress={status.progress} />;

    const modalPrimary = {
        content: 'Close',
        onAction: () => {
            reload(status?.account_id || null);
            setFile(null);
            setStarted(false);
            navigate("/accounts/" + status?.account_id);
        },
    }

    const uploadModal = file &&
        <Modal title="File Upload" open={true} onClose={onClose} primaryAction={modalPrimary}>
            <Card>
                {progress}
                {statusStuff()}
            </Card>
        </Modal >;


    return (
        <>
            <DropZone allowMultiple={false}
                onDrop={handleDropZoneDrop}
                dropOnPage={true}
                labelHidden
                type="file"
                outline={false}
            >
                {fileUpload}
            </DropZone>
            {uploadModal}

        </>
    );
}