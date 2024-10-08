"""created recipe table

Revision ID: dfe15df1d0f8
Revises: 9cee4531a4b9
Create Date: 2024-08-29 12:34:56.738200

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import Text
# revision identifiers, used by Alembic.
revision = 'dfe15df1d0f8'
down_revision = '9cee4531a4b9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('recipes',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('image', sa.String(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('ingredients', postgresql.JSON(astext_type=Text()), nullable=True),
    sa.Column('instructions', postgresql.JSON(astext_type=Text()), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_recipes_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('recipes')
    # ### end Alembic commands ###
