import React, { Component, PropTypes } from 'react';
import Card from '../card';
import GroupHeaderIcon from '../icons/group-header-icon';
import GroupListviewIcon from '../icons/group-listview-icon';
import SceneHeaderIcon from '../icons/scene-header-icon';
import SceneListviewIcon from '../icons/scene-listview-icon';
import RecipeHeaderIcon from '../icons/recipe-header-icon';
import RecipeListviewIcon from '../icons/recipe-listview-icon';
import styles from './commissioning-details-card.scss';

export default class CommissioningDetailsCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { groups, recipes, scenes } = this.props;

    return <Card headerText="Commissioning Details" className={styles['content-bottom']}>
      <div className={styles['card-container']}>
        <Card
          headerIcon={<GroupHeaderIcon className={styles.icon}/>}
          className={styles.card}
          headerText="Groups">
          {groups &&
          <ul className={styles.list}>
            {groups.map((group, ix) => {
              return <li key={ix} className={styles.item}>
                <GroupListviewIcon className={styles.icon} />
                <span className={styles['space-management-left']}>{group.name}</span>
              </li>;
            })}
          </ul>}
        </Card>
      </div>

      <div className={styles['card-container']}>
        <Card
          headerIcon={<SceneHeaderIcon className={styles.icon}/>}
          className={styles.card}
          headerText="Scenes">
          {scenes &&
          <ul className={styles.list}>
            {scenes.map((scene, ix) => {
              return <li key={ix} className={styles.item}>
                <SceneListviewIcon className={styles.icon} />
                <span className={styles['space-management-left']}>{scene.name}</span>
              </li>
            })}
          </ul>}
        </Card>
      </div>

      <div className={styles['card-container']}>
        <Card
          headerIcon={<RecipeHeaderIcon className={styles.icon}/>}
          className={styles.card}
          headerText="Recipes">
          {recipes &&
          <ul className={styles.list}>
            {recipes.map((recipe, ix) => {
              return <li key={ix} className={styles.item}>
                <RecipeListviewIcon className={styles.icon} />
                <span className={styles['space-management-left']}>{recipe.name}</span>
              </li>;
            })}
          </ul>}
        </Card>
      </div>
    </Card>;
  }
}
