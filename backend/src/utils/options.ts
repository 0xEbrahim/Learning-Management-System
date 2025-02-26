export const  courseIncludeOptions = {
    publisher: {
      select: {
        name: true,
        avatar: true,
      },
    },
    prerequisites: {
      select: {
        title: true,
      },
    },
    demo: {
      select: {
        url: true,
      },
    },
    courseData: {
      select: {
        title: true,
        videoUrl: true,
        videoLength: true,
        videoThumbnail: true,
      },
    },
    reviews: {
      select: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        review: true,
        rating: true,
        Replies: true,
      },
    },
  };