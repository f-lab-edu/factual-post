import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, Column, OneToMany, JoinColumn } from "typeorm";
import Post from "./Post";
import Like from "./Like";
import Alarm from "./Alarm";

@Entity("users")
class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true, nullable: false })
    userId: string;

    @Column({ type: "varchar", nullable: false })
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    @OneToMany(() => Alarm, (alarm) => alarm.user)
    @JoinColumn({name: 'userId'})
    alarms: Alarm[];

    @OneToMany(() => Like, (like) => like.user)
    @JoinColumn({name: 'userId'})
    likes: Like[];

    @OneToMany(() => Post, (post) => post.user)
    @JoinColumn({name: 'userId'})
    posts: Post[];
}

export default Users;
