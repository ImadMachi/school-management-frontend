// ** React Imports
import { useState, useRef, HTMLAttributes, ReactNode, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import Menu from '@mui/material/Menu'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import MenuItem from '@mui/material/MenuItem'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import ButtonGroup from '@mui/material/ButtonGroup'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { EditorState } from 'draft-js'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Imports
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Types
import { MailComposeType, FieldMenuItems } from 'src/types/apps/mailTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { sendMail } from 'src/store/apps/mail'
import { FormHelperText } from '@mui/material'

const menuItemsArr = [
  {
    id: 1,
    firstName: 'Ross',
    lastName: 'Geller',
    email: 'ross.geller@gmail.com'
  },
  {
    id: 2,
    firstName: 'Rachel',
    lastName: 'Green',
    email: 'rachel.green@gmail.com'
  }
]

const filter = createFilterOptions()

const ComposePopup = (props: MailComposeType) => {
  // ** Props
  const { mdAbove, composeOpen, composePopupWidth, toggleComposeOpen } = props

  // ** States
  const [emailTo, setEmailTo] = useState<FieldMenuItems[]>([])
  const [subjectValue, setSubjectValue] = useState<string>('')
  const [messageValue, setMessageValue] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // ** Errors
  const [emailToError, setEmailToError] = useState<boolean>(false)
  const [subjectError, setObjectError] = useState<boolean>(false)
  const [messageError, setMessageError] = useState<boolean>(false)

  // ** Ref
  const anchorRefSendBtn = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dispatch = useDispatch<AppDispatch>()

  const handleAttachmentButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      const uniqueNewFiles = newFiles.filter(newFile =>
        selectedFiles.every(existingFile => existingFile.name !== newFile.name)
      )
      setSelectedFiles(prevFiles => [...prevFiles, ...uniqueNewFiles])
    }
  }

  const handleDeleteSelectedFile = (fileName: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))
  }

  const handlePopupSendMail = () => {
    setEmailToError(false)
    setObjectError(false)
    setMessageError(false)
    const mail = {
      subject: subjectValue,
      body: messageValue,
      recipients: emailTo,
      attachments: selectedFiles
    }
    if (!emailTo.length || !subjectValue.length || !messageValue.length) {
      if (!emailTo.length) {
        setEmailToError(true)
      }
      if (!subjectValue.length) {
        setObjectError(true)
      }
      if (!messageValue.length) {
        setMessageError(true)
      }
      return
    }

    // @ts-ignore
    dispatch(sendMail(mail))
    handlePopupClose()
  }

  const handleMailDelete = (value: number, state: FieldMenuItems[], setState: (val: FieldMenuItems[]) => void) => {
    const arr = state
    const index = arr.findIndex((i: FieldMenuItems) => i.id === value)
    arr.splice(index, 1)
    setState([...arr])
  }

  const handlePopupClose = () => {
    toggleComposeOpen()
    setEmailTo([])
    setSubjectValue('')
    setMessageValue('')
    setSelectedFiles([])
  }

  const handleMinimize = () => {
    toggleComposeOpen()
    setEmailTo(emailTo)
    setMessageValue(messageValue)
    setSubjectValue(subjectValue)
  }

  const renderCustomChips = (
    array: FieldMenuItems[],
    getTagProps: ({ index }: { index: number }) => {},
    state: FieldMenuItems[],
    setState: (val: FieldMenuItems[]) => void
  ) => {
    return array.map((item, index) => (
      <Chip
        size='small'
        key={item.id}
        label={`${item.firstName} ${item.lastName}`}
        {...(getTagProps({ index }) as {})}
        deleteIcon={<Icon icon='mdi:close' />}
        onDelete={() => handleMailDelete(item.id, state, setState)}
      />
    ))
  }

  const renderListItem = (
    props: HTMLAttributes<HTMLLIElement>,
    option: FieldMenuItems,
    array: FieldMenuItems[],
    setState: (val: FieldMenuItems[]) => void
  ) => {
    return (
      <ListItem key={option.id} sx={{ cursor: 'pointer' }} onClick={() => setState([...array, option])}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {option.avatar?.length ? (
            <CustomAvatar src={option.avatar} alt={option.firstName} sx={{ mr: 3, width: 22, height: 22 }} />
          ) : (
            <CustomAvatar skin='light' color='primary' sx={{ mr: 3, width: 22, height: 22, fontSize: '.75rem' }}>
              {getInitials(option.firstName)}
            </CustomAvatar>
          )}
          <Typography sx={{ fontSize: '0.875rem' }}>
            {option.firstName} {option.lastName}
          </Typography>
        </Box>
      </ListItem>
    )
  }

  const addNewOption = (options: FieldMenuItems[], params: any): FieldMenuItems[] => {
    const filtered = filter(options, params)
    const { inputValue } = params
    const isExisting = options.some(option => inputValue === option.firstName)

    if (inputValue !== '' && !isExisting) {
      filtered.push({
        id: inputValue,
        firstName: inputValue,
        lastName: '',
        avatar: '',
        value: inputValue
      })
    }

    // @ts-ignore
    return filtered
  }

  return (
    <Drawer
      hideBackdrop
      anchor='bottom'
      open={composeOpen}
      variant='temporary'
      onClose={toggleComposeOpen}
      sx={{
        top: 'auto',
        left: 'auto',
        right: mdAbove ? '1.5rem' : '1rem',
        bottom: '1.5rem',
        display: 'block',
        zIndex: theme => `${theme.zIndex.drawer} + 1`,
        '& .MuiDrawer-paper': {
          borderRadius: 1,
          position: 'static',
          width: composePopupWidth
        }
      }}
    >
      <Box
        sx={{
          px: 4,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
        }}
      >
        <Typography sx={{ fontWeight: 500 }}>Ecrire un message</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton sx={{ p: 1, mr: 2 }} onClick={handleMinimize}>
            <Icon icon='mdi:minus' fontSize={20} />
          </IconButton>
          <IconButton sx={{ p: 1 }} onClick={handlePopupClose}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          py: 1,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          <div>
            <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-to-select'>
              À:
            </InputLabel>
          </div>
          <Autocomplete
            multiple
            freeSolo
            value={emailTo}
            clearIcon={false}
            id='email-to-select'
            filterSelectedOptions
            options={menuItemsArr}
            ListboxComponent={List}
            filterOptions={addNewOption}
            getOptionLabel={option => (option as FieldMenuItems).firstName as string}
            renderOption={(props, option) => renderListItem(props, option, emailTo, setEmailTo)}
            renderTags={(array: FieldMenuItems[], getTagProps) =>
              renderCustomChips(array, getTagProps, emailTo, setEmailTo)
            }
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': { p: 2 },
              '& .MuiAutocomplete-endAdornment': { display: 'none' }
            }}
            renderInput={params => (
              <TextField
                {...params}
                autoComplete='new-password'
                sx={{
                  border: 0,
                  '& fieldset': { border: '0 !important' },
                  '& .MuiOutlinedInput-root': { p: '0 !important' }
                }}
              />
            )}
          />
        </Box>
      </Box>
      {emailToError && (
        <FormHelperText sx={{ color: 'error.main', paddingLeft: '15px' }}>
          Le destinataire ne peut pas être vide
        </FormHelperText>
      )}
      <Box
        sx={{
          py: 1,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <div>
          <InputLabel sx={{ mr: 3, fontSize: '0.875rem' }} htmlFor='email-subject-input'>
            Objet:
          </InputLabel>
        </div>
        <Input
          fullWidth
          value={subjectValue}
          id='email-subject-input'
          onChange={e => setSubjectValue(e.target.value)}
          sx={{ '&:before, &:after': { display: 'none' }, '& .MuiInput-input': { py: 1.875 } }}
        />
      </Box>
      {subjectError && (
        <FormHelperText sx={{ color: 'error.main', paddingLeft: '15px' }}>L'objet ne peut pas être vide</FormHelperText>
      )}
      <TextField
        multiline
        fullWidth
        rows={4}
        value={messageValue}
        onChange={e => setMessageValue(e.target.value)}
        placeholder='Message'
        sx={{
          '&:before, &:after': { display: 'none' },
          '& .MuiInput-input': { py: 1.875 },
          '& fieldset': { border: 'none' }
        }}
      />
      {messageError && (
        <FormHelperText sx={{ color: 'error.main', paddingLeft: '15px' }}>
          Le message ne peut pas être vide
        </FormHelperText>
      )}

      <Box
        sx={{
          py: 1,
          px: 4,
          display: 'flex',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        {selectedFiles.map((file, index) => (
          <Box key={index} sx={{ display: 'flex', marginBottom: '3px', marginRight: '15px', alignItems: 'center' }}>
            {/* <Typography sx={{ fontSize: '0.875rem', color: 'success.main' }}>{file.name}</Typography> */}
            <Chip
              size='small'
              key={file.name}
              label={file.name}
              deleteIcon={<Icon icon='mdi:close' />}
              onDelete={() => handleDeleteSelectedFile(file.name)}
            />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          py: 2,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup variant='contained' ref={anchorRefSendBtn} aria-label='split button'>
            <Button onClick={handlePopupSendMail}>Envoyer</Button>
          </ButtonGroup>

          <IconButton size='small' sx={{ ml: 3, color: 'text.secondary' }} onClick={handleAttachmentButtonClick}>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
              multiple
            />
            <Icon icon='mdi:attachment' fontSize='1.375rem' />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ComposePopup
