import * as mongoose from 'mongoose';

export const init = () => {
    mongoose.connect('mongodb://localhost:27017/text-stream-display', { useNewUrlParser: true })
        .catch((err) => {
            /* tslint:disable-next-line no-console */
            console.log(err);
            process.exit(-1);
        });
};
