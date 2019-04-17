import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
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
  yellow, lightGreen, grey,
  lightBlue, deepPurple, amber,
} from '@material-ui/core/colors';

import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import FavoriteIcon from '@material-ui/icons/Favorite';
import VisibilityIcon from '@material-ui/icons/Visibility';


const avatarColors = [
  red[500], blue[500], pink[500], cyan[500], lightBlue[900],
  teal[500], lime[900], green[500], orange[500], purple[500],
  brown[500], deepPurple[500], yellow[900], lightGreen[900], amber[500]
];

const iconColors = [
  red[900], blue[900], pink[900], cyan[900], lightBlue[900],
  teal[900], lime[900], green[900], orange[900], purple[900],
  brown[900], deepPurple[900], yellow[900], lightGreen[900], amber[900]
];

const disabledAvatarColor = [grey[500]];

/**
 * Generic Card component to show recipe information
 */
class RecipeCardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarColor: red[500],
      time: 0,
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
      id,
      recipe,
      classes, 
      disabled,
      isFavorite,
      recommended,
      onCardActionClicked,
      onDeleteButtonClicked,
    } = this.props;

    const {
      name: title,
      desc : shortDescription,
    } = recipe;

    let avatar = 'R';

    if (title) {
      avatar = title[0];
    }

    const favoriteIconColor = isFavorite ? red[700] : null;

    // const showIngredientChips = (ingredients.length === 0) ? false : true;
    
    const titleClass = disabled ? classes.title : null;
    
    return (
      <Card className={classes.card}>
        {/* Card Top Header */}
        <CardHeader
          classes={{title: titleClass, subheader: titleClass}}
          avatar={
            <Avatar aria-label="Recipe" style={{ backgroundColor: disabled ? this.disabledAvatarColor : this.state.avatarColor }}>
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
          <Tooltip title="View" aria-label="View">
            <IconButton aria-label="View" onClick={() => onCardActionClicked(title, 'VIEW', disabled)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Favourite" aria-label="Favourite">
            <IconButton style={{ color: favoriteIconColor }} aria-label="Add to favorites" onClick={() => onCardActionClicked(title, 'FAVORITE', disabled, isFavorite)}>
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" aria-label="Edit">
            <IconButton aria-label="Edit" onClick={() => onCardActionClicked(title, 'EDIT')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share" aria-label="Share">
            <IconButton aria-label="Share" onClick={() => onCardActionClicked(title, 'SHARE')}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          {
            recommended && 
            <Tooltip title="Recommended" aria-label="Recommended">
              <IconButton aria-label="Recommended">
                <StarIcon className="rotating"/>
              </IconButton>
            </Tooltip>
          }
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
  title: { 
    color: grey[500],
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


    <Tooltip title="Delete" aria-label="Delete">
      <IconButton aria-label="Delete" onClick={() => onDeleteButtonClicked(title)}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
*/