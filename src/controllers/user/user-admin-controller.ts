import { ValidationError } from "../../errors"
import { FindUserAlreadyExists } from "../../helpers/find-user-already-exists"

const User = require('../../models/user/user-model.js')
const ProfilePicture = require('../../models/user/profilepicture-model.js')
const Statistic = require('../../models/user/statistic-model.js')

export async function block_user (req: any, res: any) {
    const { username }  = req.params

    if(await FindUserAlreadyExists({ username: username }) === false) {
        res.send( new ValidationError({
            message: 'this username cannot exists',
            statusCode: 200
        }))
    } else {
        const user = await User.findOne({
            attributes: ['username', 'blocked'],
            where: {username: username}
        })

        if(user.blocked === true){
            res.send( new ValidationError({
                message: 'this username cannot exists',
                statusCode: 200
            }))
        }
        const statistic = await Statistic.findOne({
            attributes: ['total_followers_num', 'total_likes_num', 'total_views_num'],
            where: {user_id: user.id}
        })
        const profile_picture = await ProfilePicture.findOne({
            attributes: ['fullhd_resolution', 'tiny_resolution'],
            where: {user_id: user.id}
        })
        
        return res.status(200).json({
            id: user.id,
            username: user.username,
            access_level: user.access_level,
            verifyed: user.verifyed,
            deleted: user.deleted,
            blocked: user.blocked,
            muted: user.muted,
            send_notification_emails: user.send_notification_emails,
            name: null,
            description: null,
            last_active_at: user.last_active_at,
            profile_picture: {
                fullhd_resolution: profile_picture.fullhd_resolution,
                tiny_resolution: profile_picture.tiny_resolution
            },
            statistics: {
                total_followers_num:statistic.total_followers_num,
                total_likes_num: statistic.total_likes_num,
                total_views_num:statistic.total_views_num
            }
        })
    }
}