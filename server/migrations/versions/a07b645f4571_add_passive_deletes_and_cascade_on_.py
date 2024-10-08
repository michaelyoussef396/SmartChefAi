"""Add passive deletes and cascade on recipe_category

Revision ID: a07b645f4571
Revises: bed3a692d5ed
Create Date: 2024-09-04 13:36:15.635945

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a07b645f4571'
down_revision = 'bed3a692d5ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ingredients', schema=None) as batch_op:
        batch_op.drop_constraint('fk_ingredients_recipe_id_recipes', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_ingredients_recipe_id_recipes'), 'recipes', ['recipe_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('recipe_category', schema=None) as batch_op:
        batch_op.drop_constraint('fk_recipe_category_recipe_id_recipes', type_='foreignkey')
        batch_op.drop_constraint('fk_recipe_category_category_id_categories', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_recipe_category_recipe_id_recipes'), 'recipes', ['recipe_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(batch_op.f('fk_recipe_category_category_id_categories'), 'categories', ['category_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('recipe_category', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_recipe_category_category_id_categories'), type_='foreignkey')
        batch_op.drop_constraint(batch_op.f('fk_recipe_category_recipe_id_recipes'), type_='foreignkey')
        batch_op.create_foreign_key('fk_recipe_category_category_id_categories', 'categories', ['category_id'], ['id'])
        batch_op.create_foreign_key('fk_recipe_category_recipe_id_recipes', 'recipes', ['recipe_id'], ['id'])

    with op.batch_alter_table('ingredients', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_ingredients_recipe_id_recipes'), type_='foreignkey')
        batch_op.create_foreign_key('fk_ingredients_recipe_id_recipes', 'recipes', ['recipe_id'], ['id'])

    # ### end Alembic commands ###
