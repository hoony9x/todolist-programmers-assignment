import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  AppBar, Toolbar,
  Typography,
  ButtonGroup, Button, IconButton, Icon,
  Drawer,
  List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
  Divider,
  Hidden,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Badge,
  Paper,
  TextField,
  Switch,
  Checkbox
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Group as GroupIcon,
  PlaylistAdd as PlaylistAddIcon,
  Toc as TocIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Settings as SettingsIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  PeopleOutline as PeopleOutlineIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  NoteAdd as NoteAddIcon,
  Label as LabelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  DoneOutline as DoneIcon
} from '@material-ui/icons';

import DateFnsUtils from '@date-io/date-fns';
import enLocale from "date-fns/locale/en-US";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    minHeight: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    minWidth: '100vw',

  },
  container: {
    paddingLeft: 0,
    paddingRight: 0
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: '0px 1px 7px 0px rgba(0,0,0,0.075)',
    backgroundColor: '#ffffff',
    height: '56px'
  },
  toolbar: {
    height: '56px',
    minHeight: '56px',
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing(1.5)
    },
    [theme.breakpoints.down('xs')]: {
      paddingRight: theme.spacing(1),
    }
  },
  title: {
    flexGrow: 1,
  },
  listItem: {
    paddingLeft: theme.spacing(3)
  },
  divider: {
    marginTop: '11.5px',
    marginBottom: '11.5px',
    paddingTop: '0.5px',
    paddingBottom: '0.5px'
  },
  space: {
    paddingTop: '2.5px',
    paddingBottom: '2.5px'
  },
  content: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2)
    }
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: 0,
    [theme.breakpoints.down('xs')]: {
      minHeight: window.innerHeight
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: window.innerHeight - (2 * theme.spacing(2))
    },
    backgroundColor: theme.palette.background.default
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todo_items: [
        {
          id: 1,
          title: "Test title 1",
          content: "Test content 1",
          deadline: (new Date()).toISOString(),
          priority: 0,
          finished: false
        },
        {
          id: 2,
          title: "Test title 2",
          content: "Test content 2",
          deadline: null,
          priority: 0,
          finished: false
        },
        {
          id: 3,
          title: "Test title 3",
          content: "Test content 3",
          deadline: (new Date()).toISOString(),
          priority: 0,
          finished: true
        }
      ],
      is_add_dialog_opened: false,
      new_todo_title: "",
      new_todo_content: "\n\n\n",
      new_todo_deadline: null,
      new_todo_priority: 0
    };
  }

  handleClickAddNewTodoIcon = (e) => {
    e.preventDefault();

    this.setState({
      is_add_dialog_opened: true
    });
  };

  handleCloseAddNewTodoDialog = (e) => {
    e.preventDefault();

    this.setState({
      is_add_dialog_opened: false
    });
  };

  handleNewTodoTitleChange = (e) => {
    e.preventDefault();

    this.setState({
      new_todo_title: e.target.value
    });
  };

  handleNewTodoContentChange = (e) => {
    e.preventDefault();

    this.setState({
      new_todo_content: e.target.value
    });
  };

  handleNewTodoDeadlineChange = (date) => {
    this.setState({
      new_todo_deadline: date
    });

    console.log(date);
  };

  handleClickClearNewDeadline = (e) => {
    e.preventDefault();

    this.setState({
      new_todo_deadline: null
    });
  };

  setNewPriorityValue = (priority_value) => {
    this.setState({
      new_todo_priority: priority_value
    });
  };

  // TODO: Must connect to API server
  submitNewTodo = (e) => {
    e.preventDefault();

    let datetime_iso_string;
    if(Boolean(this.state.new_todo_deadline) === false) {
      datetime_iso_string = "";
    }
    else {
      datetime_iso_string = (new Date(datetime_iso_string)).toISOString();
    }
  };

  generateDateTimeString = (date_string) => {
    if(Boolean(date_string) === false) {
      return "-";
    }
    else {
      const dateObj = new Date(date_string);

      const year = dateObj.getFullYear().toString();
      let month = (parseInt(dateObj.getMonth(), 10) + 1).toString();
      let date = dateObj.getDate().toString();
      let hour = dateObj.getHours().toString();
      let minute = dateObj.getMinutes().toString();

      if(month.length === 1) {
        month = "0" + month;
      }

      if(date.length === 1) {
        date = "0" + date;
      }

      if(hour.length === 1) {
        hour = "0" + hour;
      }

      if(minute.length === 1) {
        minute = "0" + minute;
      }

      return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    }
  };

  render() {
    const { classes, theme } = this.props;

    const appBar = (
      <AppBar className={classes.appBar} color='inherit' position='static'>
        <Toolbar className={classes.toolbar}>
          <Typography variant='h6' className={classes.title}>
            TodoList
          </Typography>

          <IconButton onClick={this.handleClickAddNewTodoIcon} color='default'>
            <NoteAddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    );

    const addNewTodoDialog = (
      <Dialog
        onClose={this.handleCloseAddNewTodoDialog}
        open={this.state.is_add_dialog_opened}
        fullWidth
      >
        <form onSubmit={this.submitNewTodo} autoComplete="off">
          <DialogTitle>Add new TodoList item</DialogTitle>

          <Divider/>

          <DialogContent>
            <TextField
              label="Title"
              type="text"
              value={this.state.new_todo_title}
              onChange={this.handleNewTodoTitleChange}
              margin="dense"
              variant="outlined"
              fullWidth
              required
              InputLabelProps={{
                shrink: true
              }}
            />

            <TextField
              label="Content"
              type="text"
              value={this.state.new_todo_content}
              onChange={this.handleNewTodoContentChange}
              margin="dense"
              variant="outlined"
              multiline
              fullWidth
              rowsMax="4"
              InputLabelProps={{
                shrink: true
              }}
            />

            <Divider className={classes.divider}/>

            <Typography variant="caption" color="textSecondary">Deadline (Optional)</Typography>

            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
              <KeyboardDatePicker
                label="Date"
                format="MM/dd/yyyy"
                placeholder="Please use date picker button"
                value={this.state.new_todo_deadline}
                onChange={(date) => this.handleNewTodoDeadlineChange(date)}
                margin="dense"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />

              <KeyboardTimePicker
                label="Time"
                format="HH:mm"
                placeholder="Please use time picker button"
                value={this.state.new_todo_deadline}
                onChange={(date) => this.handleNewTodoDeadlineChange(date)}
                margin="dense"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </MuiPickersUtilsProvider>
            
            <div className={classes.space} />

            <Button
              onClick={this.handleClickClearNewDeadline}
              variant="contained"
              size="small"
              fullWidth
              color="default"
              disabled={Boolean(this.state.new_todo_deadline) === false}
            >
              {Boolean(this.state.new_todo_deadline) === false ?
                "Deadline not set" : "Clear Deadline"
              }
            </Button>

            <Divider className={classes.divider}/>

            <Typography variant="caption" color="textSecondary">Priority</Typography>
            <ButtonGroup
              size="small"
              variant="contained"
              fullWidth
            >
              <Button
                onClick={() => this.setNewPriorityValue(0)}
                color={this.state.new_todo_priority === 0 ? "primary": "default"}
              >
                Low
              </Button>
              <Button
                onClick={() => this.setNewPriorityValue(1)}
                color={this.state.new_todo_priority === 1 ? "primary": "default"}
              >
                Mid
              </Button>
              <Button
                onClick={() => this.setNewPriorityValue(2)}
                color={this.state.new_todo_priority === 2 ? "primary": "default"}
              >
                High
              </Button>
            </ButtonGroup>

            <div className={classes.space} />
          </DialogContent>

          <Divider/>

          <DialogActions>
            <Button type="button" onClick={this.handleCloseAddNewTodoDialog} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    const displayIcon = (item) => {
      if(item.finished === true) {
        return (<DoneIcon color="primary" />);
      }
      else if(item.deadline !== null && Date.now() > item.deadline) {
        return (<WarningIcon color="secondary" />);
      }
      else {
        return (<LabelIcon/>);
      }
    };

    const todoItems = this.state.todo_items.map((item) =>
      <ListItem
        key={item.id}
        button
        className={classes.listItem}
        disabled={item.finished === true}
      >
        <ListItemIcon>
          {displayIcon(item)}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          secondary={
            <Typography
              variant="body2"
              color={(item.finished === false && item.deadline !== null && Date.now() > item.deadline) ? "secondary" : "textSecondary"}>
              {"Deadline: " + this.generateDateTimeString(item.deadline)}
            </Typography>
          }
        />

        <ListItemSecondaryAction>
          <IconButton edge="end">
            <DeleteIcon />
          </IconButton>
          <IconButton edge="end">
            <EditIcon />
          </IconButton>
          <Checkbox
            checked={item.finished}
            color="primary"
          />
        </ListItemSecondaryAction>
      </ListItem>
    );

    return (
      <div className={classes.root}>
        <CssBaseline/>

        <main className={classes.content}>
          <Container className={classes.container} maxWidth='sm'>
            <Paper className={classes.paper}>
              {appBar}

              <List component="nav">
                {todoItems}
              </List>
            </Paper>
          </Container>
        </main>

        {addNewTodoDialog}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);