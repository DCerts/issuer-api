enum NewsType {
    GROUP_CREATED = 'group_created',
    BATCH_CREATED = 'batch_created',
}

interface NewsDatum<T> {
    type: NewsType;
    datum: T;
}

interface News<T> {
    data: NewsDatum<T>;
}

export {
    News,
    NewsDatum,
    NewsType
};