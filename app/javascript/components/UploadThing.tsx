import { Button, Card, FormControl, FormLabel, IconButton, Input, LinearProgress, List, ListItem, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React from "react";
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import FileUploadIcon from '@mui/icons-material/FileUpload';

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

    const fileInput = React.useRef<HTMLInputElement>(null);
    const [dragg, setDragg] = useState<boolean>(false);

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const newFiles = Array.from(droppedFiles);
            setFile(newFiles[0] as File);
        }
        setDragg(false);
    };

    // const fileUpload = !file && <DropZone.FileUpload />;

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
                listItems.push(<ListItem>New Account Created: {status.account_name}</ListItem>);
            } else {
                listItems.push(<ListItem>Account: {status.account_name}</ListItem>);
            }
            listItems.push(<ListItem>{status.transactions} transactions processed.</ListItem>);
            listItems.push(<ListItem>{status.saved} transactions saved, {skipped} skipped</ListItem>);
            listItems.push(<ListItem>{status.categorized} transactions categorized</ListItem>);
        }

        return status && (
            <>
                <Typography component="p">Status: {status.status}</Typography>
                {status.message && (<Typography component="p">{status.message}</Typography>)}
                <List>
                    {listItems}
                </List>
            </>
        )
    };

    const progress = status?.progress && <LinearProgress determinate value={status.progress} />;

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
        <Modal open={true} onClose={onClose}>
            <ModalDialog>
                <ModalClose />
                {progress}
                {statusStuff()}
            </ModalDialog>
        </Modal >;

    return (
        <>
            <FormControl>
                <input ref={fileInput} type="file" hidden id="fileuploader"></input>
                <Button
                    onDrop={handleDrop}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragg(true);
                    }}
                    onDragLeave={() => setDragg(false)}
                    onClick={() => fileInput.current?.click()}
                    startDecorator={<FileUploadIcon />}
                    color={dragg ? "success" : "primary"}
                >
                    Upload
                </Button>
            </FormControl >
            {uploadModal}
        </>
    );
} 