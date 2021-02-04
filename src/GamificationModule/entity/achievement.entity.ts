import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Badge } from './badge.entity';
import { Audit } from '../../CommonsModule/entity/audit.entity';
import { EventNameEnum } from '../enum/event-name.enum';

@Entity()
export class Achievement<T = unknown> extends Audit {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    type: 'enum',
    enum: EventNameEnum,
  })
  eventName: EventNameEnum;

  @Column({ type: 'json' })
  rule: T;

  @Column()
  completed: boolean;

  @Column({ nullable: false })
  points: number;

  @ManyToOne(() => Badge, (badge: Badge) => badge.achievements)
  @Expose()
  badge: Badge;

  @Column('varchar', { primary: true, name: 'user_id', length: 36 })
  @Expose()
  userId: string;
}
