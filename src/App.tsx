import React, { useState, ChangeEvent, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    Container,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import { encryptScytale, decryptScytale, defaultAlphabet } from './utils';
import CipherButton from './components/CipherButton';
import ThemeToggle from './components/ThemeToggle';
import getDesignTokens from './theme';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Стилізований компонент Item
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: theme.shadows[3],
}));

const App: React.FC = () => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    const [alphabet, setAlphabet] = useState<string>(defaultAlphabet);
    const [cipherType, setCipherType] = useState<string>('scytale');
    const [inputText, setInputText] = useState<string>('');
    const [outputText, setOutputText] = useState<string>('');
    const [key, setKey] = useState<number>(4); // Змінено ключ для прикладу

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleAlphabetChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAlphabet(e.target.value.toUpperCase());
    };

    const handleCipherTypeChange = (e: ChangeEvent<{ value: unknown }>) => {
        setCipherType(e.target.value as string);
    };

    const handleInputTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputText(e.target.value.toUpperCase());
    };

    const handleOutputTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOutputText(e.target.value.toUpperCase());
    };

    const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newKey = parseInt(e.target.value, 10);
        if (!isNaN(newKey)) {
            setKey(newKey);
        }
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                if (typeof text === 'string') {
                    setInputText(text.toUpperCase());
                }
            };
            reader.readAsText(file);
        }
    };

    const validateInputs = (): boolean => {
        if (key <= 0) {
            setSnackbar({ open: true, message: 'Ключ повинен бути додатнім числом.', severity: 'error' });
            return false;
        }

        if (alphabet.length === 0) {
            setSnackbar({ open: true, message: 'Алфавіт не може бути порожнім.', severity: 'error' });
            return false;
        }

        // Для шифрування, перевіряємо inputText
        const invalidChars = inputText.split('').filter(char => !alphabet.includes(char));
        if (invalidChars.length > 0) {
            setSnackbar({ open: true, message: 'В тексті є символи, які не входять до алфавіту.', severity: 'error' });
            return false;
        }

        return true;
    };

    const validateOutputText = (): boolean => {
        if (key <= 0) {
            setSnackbar({ open: true, message: 'Ключ повинен бути додатнім числом.', severity: 'error' });
            return false;
        }

        if (alphabet.length === 0) {
            setSnackbar({ open: true, message: 'Алфавіт не може бути порожнім.', severity: 'error' });
            return false;
        }

        // Для розшифрування, перевіряємо outputText
        const invalidChars = outputText.split('').filter(char => !alphabet.includes(char));
        if (invalidChars.length > 0) {
            setSnackbar({ open: true, message: 'В зашифрованому тексті є символи, які не входять до алфавіту.', severity: 'error' });
            return false;
        }

        return true;
    };

    const handleEncrypt = () => {
        if (cipherType === 'scytale') {
            if (!validateInputs()) return;
            try {
                const cipher = encryptScytale(inputText, key, alphabet);
                setOutputText(cipher);
                setSnackbar({ open: true, message: 'Текст успішно зашифровано!', severity: 'success' });
            } catch (error: any) {
                setSnackbar({ open: true, message: error.message, severity: 'error' });
            }
        }
    };

    const handleDecrypt = () => {
        if (cipherType === 'scytale') {
            if (!validateOutputText()) return;
            try {
                const plain = decryptScytale(outputText, key, alphabet);
                setInputText(plain);
                setSnackbar({ open: true, message: 'Текст успішно розшифровано!', severity: 'success' });
            } catch (error: any) {
                setSnackbar({ open: true, message: error.message, severity: 'error' });
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleDownload = (text: string, filename: string) => {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const toggleTheme = () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" gutterBottom>
                            Шифр Скитала
                        </Typography>
                        <ThemeToggle toggleTheme={toggleTheme} mode={mode} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {/* Алфавіт */}
                            <Grid item xs={12}>
                                <Item>
                                    <TextField
                                        fullWidth
                                        label="Алфавіт"
                                        variant="outlined"
                                        value={alphabet}
                                        onChange={handleAlphabetChange}
                                        helperText="Введіть алфавіт для шифрування/розшифрування (опціонально)"
                                    />
                                </Item>
                            </Grid>

                            {/* Тип шифрування */}
                            <Grid item xs={6}>
                                <Item>
                                    <FormControl fullWidth>
                                        <InputLabel id="cipher-type-label">Тип шифрування</InputLabel>
                                        <Select
                                            labelId="cipher-type-label"
                                            value={cipherType}
                                            label="Тип шифрування"
                                            onChange={handleCipherTypeChange}
                                        >
                                            <MenuItem value="scytale">Шифр Скитала</MenuItem>
                                            {/* Можна додати інші шифри тут */}
                                        </Select>
                                    </FormControl>
                                </Item>
                            </Grid>

                            <Grid item xs={6}>
                                <Item>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Ключ (число)"
                                        variant="outlined"
                                        value={key}
                                        onChange={handleKeyChange}
                                        inputProps={{ min: 1 }}
                                        helperText="Введіть числовий ключ для шифру Скитала"
                                    />
                                </Item>
                            </Grid>

                            <Grid item xs={12}>
                                <Item>
                                    <TextField
                                        fullWidth
                                        label="Вихідний текст"
                                        variant="outlined"
                                        multiline
                                        minRows={4}
                                        value={inputText}
                                        onChange={handleInputTextChange}
                                        helperText="Введіть текст для шифрування"
                                    />
                                </Item>
                            </Grid>

                            <Grid item xs={12}>
                                <Item>
                                    <TextField
                                        fullWidth
                                        label="Зашифрований текст"
                                        variant="outlined"
                                        multiline
                                        minRows={4}
                                        value={outputText}
                                        onChange={handleOutputTextChange}
                                        helperText="Введіть зашифрований текст для розшифрування або перегляньте результат шифрування"
                                    />
                                </Item>
                            </Grid>

                            <Grid item xs={12}>
                                <Item>
                                    <Button variant="contained" component="label">
                                        Завантажити файл
                                        <input
                                            type="file"
                                            accept=".txt"
                                            hidden
                                            onChange={handleFileUpload}
                                        />
                                    </Button>
                                </Item>
                            </Grid>

                            <Grid item xs={6}>
                                <Item>
                                    <CipherButton
                                        label="Зашифрувати"
                                        onClick={handleEncrypt}
                                        color="primary"
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item>
                                    <CipherButton
                                        label="Розшифрувати"
                                        onClick={handleDecrypt}
                                        color="secondary"
                                    />
                                </Item>
                            </Grid>

                            {(inputText || outputText) && (
                                <>
                                    <Grid item xs={6}>
                                        <Item>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleDownload(inputText, 'plaintext.txt')}
                                                fullWidth
                                            >
                                                Завантажити Вихідний Текст
                                            </Button>
                                        </Item>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Item>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                onClick={() => handleDownload(outputText, 'ciphertext.txt')}
                                                fullWidth
                                            >
                                                Завантажити Зашифрований Текст
                                            </Button>
                                        </Item>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );

};

export default App;
