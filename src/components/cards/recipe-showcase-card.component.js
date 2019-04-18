import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import NutritionalValueListComponent from '../lists/nutritional-value-list.component';
import IngredientListComponent from '../../components/lists/ingredients-list.component';
import FlavorTagsChipsComponent from '../../components/chips/flavor-tags-chips.component';

/**
 * Generic Card component to show recipe information
 */
class RecipeShowCaseCard extends React.Component {
  render() {
    const { 
      recipe,
      classes, 
    } = this.props;

    const {
      name, 
      desc,
      nutVal,
      ingredients,
      instructions,
      flavorTags
    } = recipe;

    const showIngredientsList = true ? ingredients.length > 0 : false;
    const showFlavorTags = true ? flavorTags.length > 0 : false;
    
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <Typography className={classes.title} component="h6" variant="h6">
            { name } 
          </Typography>
          <Typography component="p">
            { desc } 
          </Typography>
          <Typography className={classes.secondaryTitle} component="h6" variant="h6">
            Instructions 
          </Typography>
          <Typography component="p">
            { instructions } 
          </Typography>
          {
            showIngredientsList &&
            <Typography className={classes.secondaryTitle} component="h6" variant="h6">
              Ingredients 
            </Typography>
          }
          {
            showIngredientsList &&
            <IngredientListComponent ingredients={ingredients}/>
          }
          {
            showFlavorTags &&
            <Typography className={classes.secondaryTitle} component="h6" variant="h6" className={classes.typography}>
              Flavor Tags
            </Typography>
          }
          {
            showFlavorTags &&
            <FlavorTagsChipsComponent flavorTags={flavorTags}/>
          }
          <Typography className={classes.secondaryTitle} component="h6" variant="h6">
            Nutritional Value
          </Typography>
          <NutritionalValueListComponent nutVal={nutVal}/>
        </CardContent>

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
  title: {
    fontSize: 24,
    align: "center",
  },
  content: {
  },
  secondaryTitle: {
    marginTop: 12,
  }
});

RecipeShowCaseCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeShowCaseCard);