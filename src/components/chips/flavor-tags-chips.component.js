import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

/**
 * Chip component to show ingredients associated with a recipe as a list of items
 */
class FlavorTagsChipsComponent extends React.Component {

  render() {
    const { classes, flavorTags, handleDelete } = this.props;

    return ( 
      <div>
        {
          flavorTags.map((data, id) => {
            return (
              <Chip
                key={id}
                label={data}
                onDelete={(handleDelete !== undefined) ? () => handleDelete(data) : undefined}
                className={classes.chip}
                color={(handleDelete !== undefined) ? "primary" : "primary"}
                variant={(handleDelete !== undefined) ? undefined : "outlined"}
              />
            );
          })
        }
      </div>
    );
  }
}

FlavorTagsChipsComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

export default withStyles(styles)(FlavorTagsChipsComponent);