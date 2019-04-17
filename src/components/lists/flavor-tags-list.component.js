import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

class FlavorTagListItem extends React.Component {
  render() {
    const { classes, flavorTag, onFlavorTagChecked } = this.props;
    return (
      <div>
        <ListItem className={classes.demo}>
          <Checkbox
            tabIndex={-1}
            disableRipple
            onClick={() => onFlavorTagChecked(flavorTag)}
          />
          <ListItemText
            primary={flavorTag}
          />
        </ListItem>
      </div>
    );
  }
}

/**
 * Chip component to show ingredients associated with a recipe as a list of items
 */
class FlavorTagListComponent extends React.Component {

  render() {
    const { classes, flavorTags, checked, onFlavorTagChecked } = this.props;

    return ( 
      <List dense={true}>
          <Grid 
            key={"ing_row"} 
            container 
            spacing={4}>
               {
                  flavorTags.map((data, id) => {
                    return (
                      <Grid 
                        item
                        key={id} 
                        container
                        spacing={0}
                        justify="flex-start"
                        alignItems="flex-start"
                        xs={6} sm={6} md={4} lg={3} xl={3}>
                          <FlavorTagListItem 
                            key={id} 
                            flavorTag={data}
                            classes={classes}
                            onFlavorTagChecked={onFlavorTagChecked}
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

FlavorTagListComponent.propTypes = {
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

export default withStyles(styles)(FlavorTagListComponent);

/*

 */