import * as mongoose from 'mongoose';

export const init = () => {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true })
        .catch((err) => {
            /* tslint:disable-next-line no-console */
            console.log(err);
            process.exit(-1);
        });
};
