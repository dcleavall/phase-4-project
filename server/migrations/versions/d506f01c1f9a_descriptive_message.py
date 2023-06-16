"""<descriptive message>

Revision ID: d506f01c1f9a
Revises: 8ba0e963d989
Create Date: 2023-06-16 13:58:50.983711

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd506f01c1f9a'
down_revision = '8ba0e963d989'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('selections',
    sa.Column('selection_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('nutrition_id', sa.Integer(), nullable=False),
    sa.Column('exercise_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['exercise_id'], ['exercise.id'], name=op.f('fk_selections_exercise_id_exercise')),
    sa.ForeignKeyConstraint(['nutrition_id'], ['nutrition.id'], name=op.f('fk_selections_nutrition_id_nutrition')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_selections_user_id_users')),
    sa.PrimaryKeyConstraint('selection_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('selections')
    # ### end Alembic commands ###
