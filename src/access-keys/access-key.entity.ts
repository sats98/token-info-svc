import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccessKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column({ default: 0 })
  rateLimit: number;

  @Column()
  expiration: Date;

  @Column({ default: true })
  active: boolean;
}
