import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  CssBaseline,
  Container,
  AppBar, Toolbar,
  Typography,
  ButtonGroup, Button, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon,
  Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Paper,
  TextField,
  Checkbox
} from '@material-ui/core';

import {
  NoteAdd as NoteAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@material-ui/icons';

import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-US';
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
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(1)
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(2)
    }
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

const server = axios.create({
  baseURL: '/api',
  timeout: 3000
});

const axiosErrorDisplay = (err) => {
  console.error(err);

  if(err.response !== undefined) {
    alert(err.response.data['message']);
  }
  else {
    alert("Unable to get response from server!");
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todo_items: [
        {
          id: 1,
          title: "Test title 1",
          content: "Test content 1",
          deadline: (new Date(235123532)).toISOString(),
          priority: 0,
          is_finished: false
        },
        {
          id: 2,
          title: "Test title 2",
          content: "Test content 2",
          deadline: null,
          priority: 0,
          is_finished: false
        },
        {
          id: 3,
          title: "Test title 3",
          content: "Test content 3",
          deadline: (new Date()).toISOString(),
          priority: 0,
          is_finished: true
        }
      ],
      is_add_dialog_opened: false,
      new_todo_title: "",
      new_todo_content: "\n\n\n",
      new_todo_deadline: null,
      new_todo_priority: 0,
      is_view_dialog_opened: false,
      view_item: null,
      is_edit_dialog_opened: false,
      edit_todo_id: 0,
      edit_todo_title: "",
      edit_todo_content: "",
      edit_todo_deadline: null,
      edit_todo_priority: 0
    };
  }

  componentDidMount() {
    this.getAllTodos();
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

  getAllTodos = async() => {
    let todos = null;
    try {
      todos = (await server.get('/todo')).data;
      this.setState({
        todo_items: todos
      });
    } catch(err) {
      axiosErrorDisplay(err);
    }
  };

  // TODO: Must connect to API server
  submitNewTodo = async (e) => {
    e.preventDefault();

    const datetime_ISO_string = Boolean(this.state.new_todo_deadline) === true ? (new Date(this.state.new_todo_deadline)).toISOString() : null;
    try {
      await server.post('/todo', {
        title: this.state.new_todo_title,
        content: this.state.new_todo_content,
        deadline: datetime_ISO_string,
        priority: this.state.new_todo_priority
      });

      this.setState({
        is_add_dialog_opened: false,
        new_todo_title: "",
        new_todo_content: "\n\n\n",
        new_todo_deadline: null,
        new_todo_priority: 0,
      });

      this.getAllTodos();
    } catch(err) {
      axiosErrorDisplay(err);
    }
  };

  selectEditTodo = (item) => {
    this.setState({
      is_edit_dialog_opened: true,
      edit_todo_id: item.id,
      edit_todo_title: item.title,
      edit_todo_content: item.content,
      edit_todo_deadline: Boolean(item.deadline) === true ? new Date(item.deadline) : null,
      edit_todo_priority: item.priority
    });
  };

  // TODO: Must connect to API server
  selectDeleteTodo = async (item) => {
    try {
      await server.delete('/todo/' + item.id);

      this.getAllTodos();
    } catch(err) {
      axiosErrorDisplay(err);
    }
  };

  // TODO: Must connect to API server
  selectTodoCheckBox = async (item, checked) => {
    const datetime_ISO_string = Boolean(item.deadline) === true ? (new Date(item.deadline)).toISOString() : null;
    try {
      await server.put('/todo/' + item.id, {
        title: item.title,
        content: item.content,
        deadline: datetime_ISO_string,
        priority: item.priority,
        is_finished: checked
      });

      this.getAllTodos();
    } catch(err) {
      axiosErrorDisplay(err);
    }
  };

  // TODO: Must connect to API server
  submitEditTodo = async (e) => {
    e.preventDefault();

    const datetime_ISO_string = Boolean(this.state.edit_todo_deadline) === true ? (new Date(this.state.edit_todo_deadline)).toISOString() : null;
    try {
      await server.put('/todo/' + this.state.edit_todo_id, {
        title: this.state.edit_todo_title,
        content: this.state.edit_todo_content,
        deadline: datetime_ISO_string,
        priority: this.state.edit_todo_priority
      });

      this.setState({
        is_edit_dialog_opened: false,
        edit_todo_title: "",
        edit_todo_content: "",
        edit_todo_deadline: null,
        edit_todo_priority: 0,
      });

      this.getAllTodos();
    } catch(err) {
      axiosErrorDisplay(err);
    }
  };

  handleCloseEditTodoDialog = (e) => {
    e.preventDefault();

    this.setState({
      is_edit_dialog_opened: false
    });
  };

  handleEditTodoTitleChange = (e) => {
    e.preventDefault();

    this.setState({
      edit_todo_title: e.target.value
    });
  };

  handleEditTodoContentChange = (e) => {
    e.preventDefault();

    this.setState({
      edit_todo_content: e.target.value
    });
  };

  handleEditTodoDeadlineChange = (date) => {
    this.setState({
      edit_todo_deadline: date
    });
  };

  handleClickClearEditDeadline = (e) => {
    e.preventDefault();

    this.setState({
      edit_todo_deadline: null
    });
  };

  setEditPriorityValue = (priority_value) => {
    this.setState({
      edit_todo_priority: priority_value
    });
  };

  generateDateTimeString = (date_string) => {
    if(Boolean(date_string) === false) {
      return "-";
    }
    else {
      const dateObj = new Date(date_string);
      const month_str = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

      const year = (dateObj.getFullYear().toString()).slice(2);
      const month = month_str[dateObj.getMonth() + 1];
      const date = dateObj.getDate().toString();
      const hour = dateObj.getHours().toString();
      const minute = dateObj.getMinutes().toString();

      return date + " " + month + " " + year + ", " + hour + ":" + minute;
    }
  };

  render() {
    const { classes } = this.props;

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
        fullWidth={window.innerWidth >= 600}
        fullScreen={window.innerWidth < 600}
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
                placeholder="Use button at right side"
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
                placeholder="Use button at right side"
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

    const editTodoDialog = (
      <Dialog
        onClose={this.handleCloseEditTodoDialog}
        open={this.state.is_edit_dialog_opened}
        fullWidth={window.innerWidth >= 600}
        fullScreen={window.innerWidth < 600}
      >
        <form onSubmit={this.submitEditTodo} autoComplete="off">
          <DialogTitle>Edit TodoList item</DialogTitle>

          <Divider/>

          <DialogContent>
            <TextField
              label="Title"
              type="text"
              value={this.state.edit_todo_title}
              onChange={this.handleEditTodoTitleChange}
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
              value={this.state.edit_todo_content}
              onChange={this.handleEditTodoContentChange}
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
                value={this.state.edit_todo_deadline}
                onChange={this.handleEditTodoDeadlineChange}
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
                value={this.state.edit_todo_deadline}
                onChange={this.handleEditTodoDeadlineChange}
                margin="dense"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </MuiPickersUtilsProvider>

            <div className={classes.space} />

            <Button
              onClick={this.handleClickClearEditDeadline}
              variant="contained"
              size="small"
              fullWidth
              color="default"
              disabled={Boolean(this.state.edit_todo_deadline) === false}
            >
              {Boolean(this.state.edit_todo_deadline) === false ?
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
                onClick={() => this.setEditPriorityValue(0)}
                color={this.state.edit_todo_priority === 0 ? "primary": "default"}
              >
                Low
              </Button>
              <Button
                onClick={() => this.setEditPriorityValue(1)}
                color={this.state.edit_todo_priority === 1 ? "primary": "default"}
              >
                Mid
              </Button>
              <Button
                onClick={() => this.setEditPriorityValue(2)}
                color={this.state.edit_todo_priority === 2 ? "primary": "default"}
              >
                High
              </Button>
            </ButtonGroup>

            <div className={classes.space} />
          </DialogContent>

          <Divider/>

          <DialogActions>
            <Button type="button" onClick={this.handleCloseEditTodoDialog} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="outlined" color="primary">
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    const todoItems = this.state.todo_items.map((item) =>
      <ListItem
        key={item.id}
        button
        className={classes.listItem}
      >
        <ListItemIcon>
          <Checkbox
            onChange={(e) => this.selectTodoCheckBox(item, e.target.checked)}
            checked={Boolean(item.is_finished)}
            color="primary"
          />
        </ListItemIcon>

        <ListItemText
          primary={(
            <Typography
              variant="subtitle2"
              color={(Boolean(item.is_finished) === false && Boolean(item.deadline) === true && Date.now() > new Date(item.deadline)) ? "secondary" : "textSecondary"}
            >
              {item.title}
            </Typography>
          )}
          secondary={
            <Typography
              variant="body2"
              color={(Boolean(item.is_finished) === false && Boolean(item.deadline) === true && Date.now() > new Date(item.deadline)) ? "secondary" : "textSecondary"}>
              <span role="img" aria-label="clock">&#128337;</span>{this.generateDateTimeString(item.deadline)}
            </Typography>
          }
        />

        <ListItemSecondaryAction>
          <IconButton onClick={(e) => this.selectEditTodo(item)} edge="end">
            <EditIcon />
          </IconButton>
          <IconButton onClick={(e) => this.selectDeleteTodo(item)} edge="end">
            <DeleteIcon />
          </IconButton>
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
        {editTodoDialog}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);