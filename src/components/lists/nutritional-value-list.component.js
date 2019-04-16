import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


class NutritionalValueListItem extends React.Component {
  render() {
    const { classes, name, val } = this.props;

    const description = `${name} (${val})`

    return (
      <div>
        <ListItem className={classes.demo}>
          <ListItemText
            primary={description}
          />
        </ListItem>
      </div>
    );
  }
}

/**
 * Chip component to show ingredients associated with a recipe as a list of items
 */
class NutritionalValueListComponent extends React.Component {

  render() {
    const { classes, nutVal } = this.props;

    return ( 
      <List>
          <Grid 
            key={"ing_row"} 
            container 
            spacing={8}>
               {
                  Object.keys(nutVal).map(function (key) {
                    if (key !== "extras")
                      return (
                        <Grid 
                          item
                          key={key} 
                          container
                          spacing={0}
                          justify="flex-start"
                          alignItems="flex-start"
                          xs={6} sm={6} md={3} lg={4} xl={4}>
                            <NutritionalValueListItem 
                              key={key} 
                              name={key}
                              val={nutVal[key]}
                              classes={classes} 
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

NutritionalValueListComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

NutritionalValueListComponent.defaultProps = {
  nutVal: {
    carbs : "0", 
    fiber : "0", 
    sugar : "0",
    sodium : "0",
    protein : "0", 
    calories : "0", 
    totalFat : "0",
    transFat : "0",
    cholesterol : "0", 
    saturatedFat : "0", 
  },
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

export default withStyles(styles)(NutritionalValueListComponent);