import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    InputAdornment,
    Button,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const PasswordChangeDialog = ({open, onClose, onSave, minLength = 8}) => {
    const [pwd, setPwd] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({ pwd: "", confirm: "" });

    useEffect(() => {
        if (open) {
            setPwd("");
            setConfirm("");
            setErrors({ pwd: "", confirm: "" });
            setShowPwd(false);
            setShowConfirm(false);
        }
    }, [open]);

    const validate = () => {
        const e = { pwd: "", confirm: "" };
        if (!pwd) e.pwd = "La contraseña es requerida";
        else if (pwd.length < minLength) e.pwd = `Mínimo ${minLength} caracteres`;

        if (!confirm) e.confirm = "Confirma la contraseña";
        else if (confirm !== pwd) e.confirm = "Las contraseñas no coinciden";

        setErrors(e);
        return !e.pwd && !e.confirm;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(pwd);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Cambiar contraseña</DialogTitle>

            <DialogContent dividers>
                <TextField
                    margin="dense"
                    label="Nueva contraseña"
                    type={showPwd ? "text" : "password"}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    fullWidth
                    error={Boolean(errors.pwd)}
                    helperText={errors.pwd}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPwd((s) => !s)} edge="end">
                                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="dense"
                    label="Confirmar contraseña"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    fullWidth
                    error={Boolean(errors.confirm)}
                    helperText={errors.confirm}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirm((s) => !s)} edge="end">
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} className="btn-action-back">Cancelar</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!pwd || !confirm || pwd !== confirm || pwd.length < minLength}
                >
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}

