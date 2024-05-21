import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('user created id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('user updated id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('user removed');
  }
}
