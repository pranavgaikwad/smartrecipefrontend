import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class IngredientFilterListItemComponent extends React.Component {
  render() {
    const { classes, ingredient, onIngredientChecked } = this.props;
    return (
      <div>
        <ListItem
          button 
          className={classes.demo}
          onClick={() => onIngredientChecked(ingredient)}
        >
          <ListItemText
            primary={ingredient}
          />
        </ListItem>
      </div>
    );
  }
}

/**
 * Chip component to show ingredients associated with a recipe as a list of items
 */
class IngredientFilterListComponent extends React.Component {

  render() {
    const { classes, ingredients, onIngredientChecked } = this.props;

    return ( 
      <List dense={true}>
          <Grid 
            key={"ing_row"} 
            container 
            spacing={8}>
               {
                  ingredients.map((data, id) => {
                    return (
                      <Grid 
                        item
                        key={id} 
                        container
                        spacing={0}
                        justify="flex-start"
                        alignItems="flex-start"
                        xs={6} sm={6} md={6} lg={4} xl={4}>
                          <IngredientFilterListItemComponent 
                            key={id} 
                            classes={classes}
                            ingredient={data.name}
                            onIngredientChecked={onIngredientChecked}
                          />
                      </Grid>
                    );
                  })
                }
          </Grid>

      </List>
    );
  }
}

IngredientFilterListComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
});

export default withStyles(styles)(IngredientFilterListComponent);

/*

 */