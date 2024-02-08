// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { fetchTeacher } from 'src/store/apps/teachers'
import { TeachersType } from 'src/types/apps/teacherTypes'
import EmailAppLayout from 'src/views/apps/mail/Mail'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Image from 'next/image'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { updateTeacher } from 'src/store/apps/teachers'
import { Controller, useForm } from 'react-hook-form'
import { FormHelperText } from '@mui/material'
import { formatDate } from 'src/@core/utils/format'



interface ColorsType {
  [key: string]: ThemeColor
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  dateOfEmployment?: Date;
  sex?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  phoneNumber: yup.string().required(),
  dateOfBirth: yup.date().required(),
  dateOfEmployment: yup.date().required(),
  sex: yup.string().required()
})

const UserViewLeft = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTeacherDto>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const teacherStore = useSelector((state: RootState) => state.teachers)
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<TeachersType | null>(null);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)


  const handleEditSubmit = (data: UpdateTeacherDto) => {
    // Ensure id is a number
    const teacherId = parseInt(id as string, 10);
    const partialUpdateTeacherDto: Partial<UpdateTeacherDto> = {};
    if (data.firstName) partialUpdateTeacherDto.firstName = data.firstName;
    if (data.lastName) partialUpdateTeacherDto.lastName = data.lastName;
    if (data.phoneNumber) partialUpdateTeacherDto.phoneNumber = data.phoneNumber;
    if (data.dateOfBirth) partialUpdateTeacherDto.dateOfBirth = data.dateOfBirth;
    if (data.dateOfEmployment) partialUpdateTeacherDto.dateOfEmployment = data.dateOfEmployment;
    if (data.sex) partialUpdateTeacherDto.sex = data.sex;

    // Dispatch the action with both id and updateteacherDto properties
    dispatch(updateTeacher({ id: teacherId, updateTeacherDto: data }))
      .then(() => {
        // Rest of your logic
        reset();
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Update teacher failed:', error);
      });
    handleEditClose();
    reset();

  };



  useEffect(() => {
    // Check if id exists and is a valid number
    if (id && !isNaN(Number(id))) {
      dispatch(fetchTeacher(Number(id)) as any);
      console.log('fetching admin');
    }
    // Cleanup function to reset state on component unmount
    return () => {
      // Reset state when the component is unmounted
      setUserData(null);
    };
  }, [id]);




  useEffect(() => {
    // Update state when the data is updated
    if (teacherStore.data && teacherStore.data.length > 0) {
      setUserData(teacherStore.data[0]);
    }
  }, [teacherStore.data]);

  if (userData) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} >
          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <Avatar
                alt='John Doe'
                sx={{ width: 80, height: 80 }}
                src='/images/avatars/1.png'
              />              <Typography variant='h6' sx={{ mb: 4 }}>
                {userData.firstName} {userData.lastName}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label='Administrateur'
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>1.23k</Typography>
                    <Typography variant='body2'> Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Icon icon='mdi:star-outline' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6'>568</Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ my: theme => `${theme.spacing(4)} !important` }} />
              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Prénom:</Typography>
                  <Typography variant='body2'>{userData.firstName}</Typography>
                </Box>   <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Nom:</Typography>
                  <Typography variant='body2'>{userData.lastName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Contact:</Typography>
                  <Typography variant='body2'>{userData.phoneNumber}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>La date de naissance:</Typography>
                  <Typography variant='body2'>{formatDate(userData.dateOfBirth)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>La date d'employment:</Typography>
                  <Typography variant='body2'>{formatDate(userData.dateOfEmployment)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Sexe:</Typography>
                  <Typography variant='body2'>{userData.sex}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Language:</Typography>
                  <Typography variant='body2'>English</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Country:</Typography>
                  <Typography variant='body2'>Maroc</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' onClick={handleEditClickOpen}>
                Modifier
              </Button>
              {/* <Button color='error' variant='outlined' onClick={() => setSuspendDialogOpen(true)}>
                Suspend
              </Button> */}
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby='user-view-edit-description'
            >
              <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Modifier les inforamtions du l’utilisateur
              </DialogTitle>
              <DialogContent>
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <form onSubmit={handleSubmit(handleEditClose)}>
                  <Grid container spacing={6} >
                    <Grid item xs={12} sm={6}>
                      {/* <TextField fullWidth label='First Name' defaultValue={userData.firstName} /> */}
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='firstName'
                          control={control}
                          defaultValue={userData.firstName}
                          rules={{ required: 'Prénom est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Prénom'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='lastName'
                          control={control}
                          defaultValue={userData.lastName}
                          rules={{ required: 'Nom est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Nom'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='phoneNumber'
                          control={control}
                          defaultValue={userData.phoneNumber}
                          rules={{ required: 'Contact est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Contact'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='dateOfBirth'
                          control={control}
                          defaultValue={new Date(userData.dateOfBirth).toLocaleDateString()}
                          rules={{ required: 'date de naissance est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Date de naissance'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='dateOfEmployment'
                          control={control}
                          defaultValue={new Date(userData.dateOfEmployment).toLocaleDateString()}
                          rules={{ required: 'Date employement est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Date employement'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>

                      <FormControl fullWidth sx={{ mb: 6 }}>
                        <Controller
                          name='sex'
                          control={control}
                          defaultValue={userData.sex}
                          rules={{ required: 'Sexe est requis' }}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth sx={{ mb: 6 }}>
                              <TextField
                                {...field}
                                label='Sexe'
                                error={Boolean(fieldState.error)}
                                helperText={fieldState.error?.message}
                              />
                            </FormControl>
                          )}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid>
                  </Grid>
                </form>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit(handleEditSubmit)}>
                  Submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            {/* 
            <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} />
            <UserSubscriptionDialog open={subscriptionDialogOpen} setOpen={setSubscriptionDialogOpen} /> */}
          </Card>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: 'flex' }} >
          <EmailAppLayout folder='inbox' />
        </Grid>
      </Grid >
    )
  } else {
    return null
  }
}

export default UserViewLeft
