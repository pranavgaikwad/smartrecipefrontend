import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import {
  red, blue,
  pink, cyan,
  teal, lime,
  green, brown,
  orange, purple,
  yellow, lightGreen,
  lightBlue, deepPurple, amber,
} from '@material-ui/core/colors';

import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';

const avatarColors = [
  red[500], blue[500], pink[500], cyan[500], lightBlue[900],
  teal[500], lime[900], green[500], orange[500], purple[500],
  brown[500], deepPurple[500], yellow[900], lightGreen[900], amber[500]
];

/**
 * Generic Card component to show recipe information
 */
class RecipeCardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarColor: red[500],
    }

    this.avatarColor = red[500];
  }

  componentDidMount() {
    this.setState({
      avatarColor: avatarColors[Math.floor(Math.random()*avatarColors.length)],
    });
  }

  render() {
    const { 
      recipe,
      classes, 
      onCardActionClicked,
      onDeleteButtonClicked,
    } = this.props;

    const {
      _id: id,
      name: title,
      ingredients,
      desc : shortDescription,
    } = recipe;

    let avatar = 'R';

    if (title) {
      avatar = title[0];
    }

    // const showIngredientChips = (ingredients.length === 0) ? false : true;
    
    return (
      <Card className={classes.card}>
        {/* Card Top Header */}
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" style={{ backgroundColor: this.state.avatarColor }}>
              {avatar}
            </Avatar>
          }
          title={ title }
          subheader="September 14, 2016"
        />

        {/* Short Description */}
        <CardContent className={classes.content}>
          <Typography component="p">
            { shortDescription } 
          </Typography>
        </CardContent>

        {/* Card Footer */}
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="View" onClick={() => onCardActionClicked(id, 'VIEW')}>
            <VisibilityIcon />
          </IconButton>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Edit" onClick={() => onCardActionClicked(id, 'EDIT')}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="Delete" onClick={() => onDeleteButtonClicked(id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="Share" onClick={() => onCardActionClicked(id, 'SHARE')}>
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    margin: 5,
    width: '100%',
    maxWidth: '100%',
    minHeight: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  content: {
    height: 90,
    overflow: 'hidden',
  },
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  actions: {
    display: 'flex',
    align: 'bottom',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

RecipeCardComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeCardComponent);

/*
    {
      showIngredientChips 
      ? <IngredientChipsComponent ingredients={ingredients}/> : 
      <Typography component="p">No ingredients...</Typography>
    }
*/