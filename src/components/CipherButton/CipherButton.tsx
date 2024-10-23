import React from 'react';
import { Button } from '@mui/material';
import {CipherButtonProps} from "./types.ts";

const CipherButton: React.FC<CipherButtonProps> = ({ label, onClick, color = 'primary' }) => {
    return (
        <Button
            variant="contained"
            color={color}
            onClick={onClick}
            fullWidth
        >
            {label}
        </Button>
    );
};

export default CipherButton;


