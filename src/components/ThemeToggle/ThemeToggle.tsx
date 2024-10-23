import React from 'react';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import {ThemeToggleProps} from "./types.ts";

const ThemeToggle: React.FC<ThemeToggleProps> = ({ toggleTheme, mode }) => {
    return (
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
};

export default ThemeToggle;


