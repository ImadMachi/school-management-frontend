import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ThemeColor } from 'src/@core/layouts/types';
import { AdministratorType } from 'src/types/apps/administratorTypes';
import { updateAdministrator } from 'src/store/apps/administrator';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';

interface ColorsType {
    [key: string]: ThemeColor;
}

interface EditDialogProps {
    open: boolean;
    onClose: () => void;
    user: AdministratorType;
}

const Sup = styled('sup')(({ theme }) => ({
    top: '0.2rem',
    left: '-0.6rem',
    position: 'absolute',
    color: theme.palette.primary.main
}));

const Sub = styled('sub')({
    fontWeight: 300,
    fontSize: '1rem',
    alignSelf: 'flex-end'
});

export interface UpdateAdministratorDto {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }
  
const EditAdministrator: React.FC<EditDialogProps> = ({ open, onClose}) => {
    const dispatch = useDispatch<AppDispatch>();

    // // State to manage changes to user data
    // const [updatedData, setUpdatedData] = useState<Partial<AdministratorType>>({
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     phoneNumber: user.phoneNumber,
    //   });
    

    // Update user data when input values change

    const handleUpdate = () => {
        // const updateDto: UpdateAdministratorDto = {
        //   firstName: updatedData.firstName,
        //   lastName: updatedData.lastName,
        //   phoneNumber: updatedData.phoneNumber,
        //   // Add other properties as needed
        // };
      
        // // Dispatch the update action with the user's ID and updated data
        // dispatch(updateAdministrator({ id: user.id, updateAdministratorDto: updateDto }) as any);
        // // Close the edit dialog
        // onClose();
      };
      


    function handleInputChange(arg0: string, value: string): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='user-view-edit'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
            aria-describedby='user-view-edit-description'
        >
            <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Edit User Information
            </DialogTitle>
            <DialogContent>
                <form>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Last Name'
                                // value={}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='First Name'
                                // value={user.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label='Contact'
                                // value={user.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' sx={{ mr: 1 }} onClick={handleUpdate}>
                    Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAdministrator;
