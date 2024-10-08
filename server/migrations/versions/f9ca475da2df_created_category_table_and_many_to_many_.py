"""created category table and many-to-many relationship with recipe

Revision ID: f9ca475da2df
Revises: 22f3f044894e
Create Date: 2024-08-29 12:40:46.375304

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f9ca475da2df'
down_revision = '22f3f044894e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('recipe_category',
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['category_id'], ['categories.id'], name=op.f('fk_recipe_category_category_id_categories')),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], name=op.f('fk_recipe_category_recipe_id_recipes')),
    sa.PrimaryKeyConstraint('recipe_id', 'category_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recipe_category')
    op.drop_table('categories')
    # ### end Alembic commands ###
