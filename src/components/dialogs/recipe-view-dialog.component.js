import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import IngredientListComponent from '../lists/ingredients-list.component';
import NutritionalValueListComponent from '../lists/nutritional-value-list.component';
import FlavorTagsChipsComponent from '../chips/flavor-tags-chips.component';

/**
 * Dialog which shows recipe in a detailed view
 */
class RecipeViewCard extends Component {
  render() {
    const {
      open, 
      recipe,
      onClose,
      classes,
    } = this.props;
    
    const {
      name: title, 
      disabled,
      ingredients,
      nutVal,
      flavorTags,
      instructions: description,
    } = recipe;

    const showIngredientList = (ingredients.length === 0) ? false : true;

    const showFlavorTags = (flavorTags.length === 0) ? false : true;

    return (
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {
            disabled &&
            <Typography className={classes.warning} component="p">You cannot make this reipe with your ingredients!</Typography>
          }
          {
            showIngredientList &&
            <Typography className={classes.typography} component="h6" variant="h6">Ingredients</Typography>
          }
          {
            showIngredientList &&
            <IngredientListComponent ingredients={ingredients}/>
          }
          {
            showFlavorTags &&
            <Typography component="h6" variant="h6" className={classes.typography}>
              Flavor Tags
            </Typography>
          }
          {
            showFlavorTags &&
            <FlavorTagsChipsComponent flavorTags={flavorTags}/>
          }
          <Typography component="h6" variant="h6" className={classes.typography}>
            Instructions
          </Typography>
          <Typography component="p">
            {description} 
          </Typography>
          <Typography component="h6" variant="h6" className={classes.typography}>
            Nutritional Value
          </Typography>
          <NutritionalValueListComponent nutVal={nutVal}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = theme => ({
  divider: {
    marginTop: 15,
    marginBottom: 15,
  },
  typography: {
    marginTop : 5,
    marginBottom: 5,
  },
  warning: {
    marginTop : 5,
    marginBottom: 5,
    color: "#f00",
  }
});

RecipeViewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeViewCard);