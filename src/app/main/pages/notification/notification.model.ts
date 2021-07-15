export class NotificationModel {
    id: string;
    from: {
        name: string,
        avatar: string,
        email: string
    };
    to: {
        name: string,
        email: string
    }[];
    subject: string;
    message: string;
    time: string;
    read: boolean;
    starred: boolean;
    important: boolean;
    hasAttachments: boolean;
    attachments: {
        type: string,
        fileName: string,
        preview: string,
        url: string,
        size: string
    }[];
    labels: string[];
    folder: string;

    /**
     * Constructor
     *
     * @param mail
     */
    constructor(mail) {
        this.id = mail.id;
        this.from = mail.from;
        this.to = mail.to;
        this.subject = mail.subject;
        this.message = mail.message;
        this.time = mail.time;
        this.read = mail.read;
        this.starred = mail.starred;
        this.important = mail.important;
        this.hasAttachments = mail.hasAttachments;
        this.attachments = mail.attachments;
        this.labels = mail.labels;
        this.folder = mail.folder;
    }

    toggleStar(): void {
        this.starred = !this.starred;
    }

    toggleImportant(): void {
        this.important = !this.important;
    }
}

export class MailFakeDb {
    public static mails: any = [
        {
            'id': '15459251a6d6b397565',
            'from': {
                'name': 'Alice Freeman',
                'avatar': 'assets/images/avatars/alice.jpg',
                'email': 'alicefreeman@creapond.com'
            },
            'to': [
                {
                    'name': 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject': 'Commits that need to be pushed lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'message': '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce lorem diam, pulvinar id nisl non, ultrices maximus nibh. Suspendisse ut justo velit. Nullam ac ultrices risus, quis auctor orci. Vestibulum volutpat nisi et neque porta ullamcorper. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem. </p><p> In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend. Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem. </p><p> Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui. Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem. </p>',
            'time': '28-12-2018',
            'read': false,
            'starred': false,
            'important': true,
            'hasAttachments': true,
            'attachments': [
                {
                    'type': 'image',
                    'fileName': 'flowers',
                    'preview': 'assets/images/etc/flowers-thumb.jpg',
                    'url': '',
                    'size': '1.1Mb'
                },
                {
                    'type': 'image',
                    'fileName': 'snow',
                    'preview': 'assets/images/etc/snow-thumb.jpg',
                    'url': '',
                    'size': '380kb'
                },
                {
                    'type': 'image',
                    'fileName': 'sunrise',
                    'preview': 'assets/images/etc/sunrise-thumb.jpg',
                    'url': 'assets/images/etc/early-sunrise.jpg',
                    'size': '17Mb'
                }
            ],
            'labels': [
                1
            ],
            'folder': 0
        },
        {
            'id': '154588a0864d2881124',
            'from': {
                'name': 'Lawrence Collins',
                'avatar': 'assets/images/avatars/vincent.jpg',
                'email': 'lawrencecollins@creapond.com'
            },
            'to': [
                {
                    'name': 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject': 'Displaying data in a table is expensive, because to lay out the table all the data must be measured twice, once to negotiate.',
            'message': '<p>Displaying data in a table is expensive, because to lay out the table all the data must be measured twice, once to negotiate the dimensions to use for each column, and once to actually lay out the table given the results of the negotiation. ultrices maximus nibh. Suspendisse ut justo velit. Nullam ac ultrices risus, quis auctor orci. Vestibulum volutpat nisi et neque porta ullamcorper. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem. </p><p> In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend. Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem. </p><p> Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui. Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem. </p>',
            'time': '28-12-2018',
            'read': false,
            'starred': false,
            'important': false,
            'hasAttachments': false,
            'labels': [],
            'folder': 0
        },
        {
            'id': '15453ba60d3baa5daaf',
            'from': {
                'name': 'Judith Burton',
                'avatar': 'assets/images/avatars/joyce.jpg',
                'email': 'judithburton@creapond.com'
            },
            'to': [
                {
                    'name': 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject': 'The RenderObject hierarchy is used by the Flutter Widgets library to implement its layout and painting back-end. Generally, while you may use custom RenderBox classes for specific effects in your applications.',
            'message': '<p>The RenderObject hierarchy is used by the Flutter Widgets library to implement its layout and painting back-end. Generally, while you may use custom RenderBox classes for specific effects in your applications, most of the time your only interaction with the RenderObject hierarchy will be in debugging layout issues. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem. </p><p> In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend. Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem. </p><p> Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui. Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem. </p>',
            'time': '28-12-2018',
            'read': true,
            'starred': false,
            'important': false,
            'hasAttachments': false,
            'labels': [
                3,
                2
            ],
            'folder': 0
        },
        {
            'id': '15453a06c08fb021776',
            'from': {
                'name': 'Danielle Obrien',
                'avatar': 'assets/images/avatars/danielle.jpg',
                'email': 'danielleobrien@creapond.com'
            },
            'to': [
                {
                    'name': 'me',
                    'email': 'johndoe@creapond.com'
                }
            ],
            'subject': 'The library makes sure that tasks are only run when appropriate. For example, an idle-task is only executed when no animation is running.',
            'message': '<p>The library makes sure that tasks are only run when appropriate. For example, an idle-task is only executed when no animation is running. Maecenas porttitor porta erat ac suscipit. Sed cursus leo ut elementum fringilla. Maecenas semper viverra erat, vel ullamcorper dui efficitur in. Vestibulum placerat imperdiet tellus, et tincidunt eros posuere eget. Proin sit amet facilisis libero. Nulla eget est ut erat aliquet rhoncus. Quisque ac urna vitae dui hendrerit sollicitudin vel id sem. </p><p> In eget ante sapien. Quisque consequat velit non ante finibus, vel placerat erat ultricies. Aliquam bibendum justo erat, ultrices vehicula dolor elementum a. Mauris eu nisl feugiat ligula molestie eleifend. Aliquam efficitur venenatis velit ac porta. Vivamus vitae pulvinar tellus. Donec odio enim, auctor eget nibh mattis, ultricies dignissim lacus. Phasellus non tincidunt dui. Nulla eu arcu lorem. </p><p> Donec non hendrerit augue, lobortis sollicitudin odio. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis sit amet euismod enim, eget vestibulum justo. Fusce a placerat lectus, eget feugiat purus. Cras risus ante, faucibus eget justo commodo, volutpat tempor ante. Donec sit amet leo venenatis, gravida quam sit amet, blandit dui. In quam ante, elementum ut faucibus nec, tristique vitae dui. Praesent vel erat at enim placerat luctus vel ut ipsum. In congue tempor mi, non ornare lectus condimentum at. Aenean libero diam, finibus eget sapien et, tristique fermentum lorem. </p>',
            'time': '28-12-2018',
            'read': true,
            'starred': true,
            'important': false,
            'hasAttachments': false,
            'labels': [
                1,
                3
            ],
            'folder': 0
        }
    ];

    public static folders = [
        {
            'id': 0,
            'handle': 'inbox',
            'title': 'Inbox',
            'icon': 'inbox'
        },
        {
            'id': 1,
            'handle': 'sent',
            'title': 'Sent',
            'icon': 'send'
        },
        {
            'id': 2,
            'handle': 'drafts',
            'title': 'Drafts',
            'icon': 'email_open'
        },
        {
            'id': 3,
            'handle': 'spam',
            'title': 'Spam',
            'icon': 'error'
        },
        {
            'id': 4,
            'handle': 'trash',
            'title': 'Trash',
            'icon': 'delete'
        }
    ];

    public static filters = [
        {
            'id': 0,
            'handle': 'starred',
            'title': 'Starred',
            'icon': 'star',
            'color': 'amber-fg'
        },
        {
            'id': 1,
            'handle': 'important',
            'title': 'Important',
            'icon': 'label',
            'color': 'red-fg'
        }
    ];

    public static labels = [
        {
            'id': 0,
            'handle': 'note',
            'title': 'Note',
            'color': '#7cb342'
        },
        {
            'id': 1,
            'handle': 'paypal',
            'title': 'Paypal',
            'color': '#d84315'
        },
        {
            'id': 2,
            'handle': 'invoice',
            'title': 'Invoice',
            'color': '#607d8b'
        },
        {
            'id': 3,
            'handle': 'amazon',
            'title': 'Amazon',
            'color': '#03a9f4'
        }
    ];
}
