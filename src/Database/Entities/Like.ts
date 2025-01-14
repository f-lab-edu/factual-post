import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import Users from "./Users";
import Post from "./Post";

@Entity("likes")
class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Users, (user) => user.likes, { lazy: true })
    @JoinColumn({name: 'userId'})
    user: Promise<Users>;

    @ManyToOne(() => Post, (post) => post.likes, { lazy: true })
    @JoinColumn({name: 'postId'})
    post: Promise<Post>;
}

export default Like;
