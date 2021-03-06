import {Exclude} from "class-transformer";
import {PublicFile} from "src/files/entities/public-file.entity";
import {Post} from "src/posts/entities/post.entity";
import {Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Address} from "./address.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({ unique: true })
    public email: string;

    @Column()
    public name: string;

    @Column()
    @Exclude()
    public password: string;

    @OneToOne(() => Address, {
        eager: true,
        cascade: true
    })
    @JoinColumn()
    public address: Address;

    @OneToMany(() => Post, (post: Post) => post.author)
    public posts: Post[];

    @JoinColumn()
    @OneToOne(() => PublicFile, { eager: true, nullable: true })
    public avatar?: PublicFile
}
