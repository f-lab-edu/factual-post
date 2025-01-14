import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import Users from "./Users";
import Like from "./Like";

@Entity('posts')
class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  contents: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Users, (user) => user.posts, { lazy: true })
  @JoinColumn({name: 'userId'})
  user: Promise<Users>;

  @OneToMany(() => Like, (like) => like.post)
  @JoinColumn({name: 'postId'})
  likes: Like[];
}

export default Post;
