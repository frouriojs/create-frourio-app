import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  label: string

  @Column({ default: false })
  done: boolean
}
