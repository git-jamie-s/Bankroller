import React from "react";
import { Card, DropZone, Link, List, Modal, Text } from '@shopify/polaris';
import { useState, useCallback } from 'react';

interface UploadResponse {
    status: string;
    message?: string;
    account_id?: number;
    account_name?: string;
    link?: string;
    transactions?: number;
    categorized?: number;
    saved?: number;
};

interface Props {
    reload: (account_id: number | null) => void;
}

export const UploadThing: React.FC<Props> = ({ reload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [started, setStarted] = useState<boolean>(false);
    const [status, setStatus] = useState<UploadResponse | null>(null);

    const handleDropZoneDrop = useCallback(
        (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
            setFile(acceptedFiles[0]),
        [],
    );

    const fileUpload = !file && <DropZone.FileUpload />;

    if (file && !started) {
        const csrfToken = document.querySelector('meta[name=csrf-token]')?.getAttribute('content') || '';

        setStarted(true);

        setStatus({ status: "Upload started", message: "" });
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
                setStatus({ status: data.statusText, message: `Upload of ${file.name} failed` });
                reload(null);
            }
        }).catch((e) => {
            setStatus({ status: "Upload failed", message: e.message });
        });
    }

    const onClose = () => {
        setFile(null);
        setStarted(false);
    }

    console.log(status);
    const success = () => {

        if (status === null)
            return null;

        const listItems: any[] = [];

        if (status.account_name && status.account_id) {
            const url = `/accounts/${status.account_id}`;
            listItems.push(
                <List.Item>Account: <Link url={url}>{status.account_name}</Link></List.Item>
            )
        }


        if (status.transactions) {
            const skipped = status.transactions - status.saved!;
            listItems.push(<List.Item>{status.transactions} transactions processed.</List.Item>);
            listItems.push(<List.Item>{status.saved} transactions saved, {skipped} skipped</List.Item>)
            listItems.push(<List.Item>{status.categorized} transactions categorized</List.Item>)
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


    const uploadModal = file &&
        <Modal title="File Upload" open={true} onClose={onClose}>
            <Card>
                {success()}
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