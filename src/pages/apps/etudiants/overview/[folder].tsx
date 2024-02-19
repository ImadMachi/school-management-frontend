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
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { fetchStudent, updateStudent } from 'src/store/apps/students'
import { StudentsType } from 'src/types/apps/studentTypes'
import EmailAppLayout from 'src/views/apps/student/overview/mail/Mail'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Image from 'next/image'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserSuspendDialog from '../../../../views/apps/administrators/overview/UserSuspendDialog'
import UserSubscriptionDialog from '../../../../views/apps/administrators/overview/UserSubscriptionDialog'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { Controller, useForm } from 'react-hook-form'
import { formatDate } from 'src/@core/utils/format'



interface ColorsType {
  [key: string]: ThemeColor
}

export interface UpdateStudentDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  sex?: string;
}

const schema = yup.object().shape({
  firstName: yup.string().min(3).required(),
  lastName: yup.string().min(3).required(),
  dateOfBirth: yup.date().required(),
  sex: yup.string().required()
})

const UserViewLeft = () => {
  const router = useRouter();
  const { folder } = router.query;
  const selectedId = useSelector((state: RootState) => state.students.selectedId);
  const id = selectedId
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateStudentDto>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const studentStore = useSelector((state: RootState) => state.students)
  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  // const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  // const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState<boolean>(false)
  const [userData, setUserData] = useState<StudentsType | null>(null);


  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)


  const handleEditSubmit = (data: UpdateStudentDto) => {
    // Ensure id is a number
    const studentId = parseInt(id as unknown as string, 10);
    const partialUpdateStudentDto: Partial<UpdateStudentDto> = {};
    if (data.firstName) partialUpdateStudentDto.firstName = data.firstName;
    if (data.lastName) partialUpdateStudentDto.lastName = data.lastName;
    if (data.dateOfBirth) partialUpdateStudentDto.dateOfBirth = data.dateOfBirth;
    if (data.sex) partialUpdateStudentDto.sex = data.sex;

    // Dispatch the action with both id and UpdateStudentDto properties
    dispatch(updateStudent({ id: studentId, updateStudentDto: data }))
      .then(() => {
        // Rest of your logic
        reset();
      })
      .catch((error) => {
        // Handle error if needed
        console.error('Update Student failed:', error);
      });
    handleEditClose();
    reset();

  };



  useEffect(() => {
    // Check if id exists and is a valid number
    if (id && !isNaN(Number(id))) {
      dispatch(fetchStudent(Number(id)) as any);
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
    if (studentStore.data && studentStore.data.length > 0) {
      setUserData(studentStore.data[0]);
    }
  }, [studentStore.data]);

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
                label='Étudiant'
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            {/* <CardContent sx={{ my: 1 }}>
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
            </CardContent> */}

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
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>La date de naissance:</Typography>
                  <Typography variant='body2'>{formatDate(userData.dateOfBirth)}</Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', mb: 2 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Langue:</Typography>
                  <Typography variant='body2'>English</Typography>
                </Box> */}
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Pays:</Typography>
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
                          name='dateOfBirth'
                          control={control}
                          defaultValue={new Date(userData.dateOfBirth).toLocaleDateString()}
                          rules={{ required: 'Date de naissance est requis' }}
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
                    {/* <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid> */}
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
          <EmailAppLayout folder={folder as string} />
        </Grid>
      </Grid >
    )
  } else {
    return null
  }
}

export default UserViewLeft
