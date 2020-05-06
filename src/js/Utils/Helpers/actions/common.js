export const checkIfAlreadyOnList = (medias, searchedMedias) => {
    medias.forEach(media => {
        searchedMedias.forEach(searchedMedia => {
            if (media.id === searchedMedia.id) {
                Object.assign(searchedMedia, {
                    isMediaOnList: true
                });
            }
        });
    });
};
