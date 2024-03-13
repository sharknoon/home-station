import type { FromSchema } from 'json-schema-to-ts';
import appRawSchema from './app.schema.json';

// Yes this is code dupliucation, but TS will throw an error, if the types don't overlap
// See https://github.com/ThomasAribart/json-schema-to-ts/blob/main/documentation/FAQs/does-json-schema-to-ts-work-on-json-file-schemas.md
const appSchema = appRawSchema as {
    $schema: 'https://json-schema.org/draft/2020-12/schema';
    $id: 'https://home-station.org/app.schema.json';
    title: 'Home Station app.yml schema';
    description: 'A Home Station app represented by a app.yml file';
    type: 'object';
    properties: {
        uuid: {
            title: 'UUID';
            description: 'The universally unique id of the app. You can generate a UUID here: https://www.uuidgenerator.net/version7 .';
            examples: ['018e2df9-aa80-771c-98ba-0f2e68a302ab'];
            type: 'string';
            format: 'uuid';
        };
        name: {
            title: 'Name';
            description: 'The name of the app.';
            examples: ['My App'];
            $ref: '#/$defs/localizedString';
            additionalProperties: {
                minLength: 2;
                maxLength: 30;
            };
        };
        description: {
            title: 'Description';
            description: 'A description of the app. It should give a brief overview of what the app does and why it is useful.';
            examples: [
                'My App is a great app that does great things. It is useful because it does great things. It is great.'
            ];
            $ref: '#/$defs/localizedString';
            additionalProperties: {
                minLength: 100;
                maxLength: 5000;
            };
        };
        icon: {
            title: 'Icon';
            description: "The icon of the app. It should be a square PNG or a SVG file. Transparent backgrounds are filled in with white. If the icon isn't square, the css property `object-fit: contain` will be applied.";
            examples: ['icon.svg'];
            type: 'string';
            format: 'uri-reference';
        };
        banner: {
            title: 'Banner';
            description: "The banner of the app. It should be a PNG or a SVG file. The aspect ratio should be 16:9. Transparent backgrounds are filled in with white. If the banner isn't 16:9, the css property `object-fit: contain` will be applied.";
            examples: ['banner.png'];
            type: 'string';
            format: 'uri-reference';
        };
        screenshots: {
            title: 'Screenshots';
            description: 'Screenshots of the app. They should be PNG or SVG files. Transparent backgrounds are filled in with white.';
            type: 'array';
            items: {
                examples: ['screenshot1.png', 'screenshot2.png'];
                type: 'string';
                format: 'uri-reference';
            };
        };
        links: {
            title: 'Links';
            description: 'Links to the repository, website and custom links of the app.';
            type: 'object';
            properties: {
                repository: {
                    title: 'Repository link';
                    description: 'The repository of the app.';
                    examples: ['https://github.com/example/example'];
                    type: 'string';
                    format: 'uri';
                };
                website: {
                    title: 'Website link';
                    description: 'The website of the app.';
                    examples: ['https://example.com'];
                    type: 'string';
                    format: 'uri';
                };
                custom: {
                    type: 'array';
                    items: {
                        title: 'Custom link';
                        description: 'A custom link of the app that is not the repository or the website. It can be a link to the documentation, the support or the changelog of the app.';
                        type: 'object';
                        properties: {
                            name: {
                                title: 'Link name';
                                description: 'The name of the custom link.';
                                examples: ['Documentation'];
                                $ref: '#/$defs/localizedString';
                                additionalProperties: {
                                    minLength: 2;
                                    maxLength: 30;
                                };
                            };
                            url: {
                                title: 'Link url';
                                description: 'The url of the custom link.';
                                examples: ['https://example.com'];
                                type: 'string';
                                format: 'uri';
                            };
                        };
                        additionalProperties: false;
                        required: ['name', 'url'];
                    };
                };
            };
            additionalProperties: false;
            required: ['repository'];
        };
        publishedAt: {
            title: 'Published at';
            description: 'The date and time when the app was published.';
            examples: ['2024-03-11T15:48:54Z'];
            type: 'string';
            format: 'date-time';
        };
        developer: {
            title: 'Developer';
            description: 'The developer of the app.';
            examples: ['John Doe'];
            type: 'string';
            minLength: 2;
            maxLength: 30;
        };
        category: {
            title: 'Category';
            description: 'The category of the app.';
            examples: ['productivity'];
            type: 'string';
            enum: [
                'books',
                'medical',
                'business',
                'music',
                'developer-tools',
                'navigation',
                'education',
                'news',
                'entertainment',
                'photo-and-video',
                'finance',
                'productivity',
                'food-and-drink',
                'reference',
                'games',
                'graphics-and-design',
                'shopping',
                'health-and-fitness',
                'social-networking',
                'lifestyle',
                'sports',
                'kids',
                'travel',
                'magazines-and-newspapers',
                'utilities',
                'weather'
            ];
        };
        license: {
            title: 'License';
            description: 'The license of the app.';
            examples: ['Apache-2.0'];
            type: 'string';
            minLength: 2;
        };
        config: {
            title: 'Configuration';
            description: 'Additional configuration options for the app. The options can be set by the user during the installation of the app.';
            type: 'array';
            items: {
                type: 'object';
                properties: {
                    id: {
                        title: 'ID';
                        description: 'The id of the configuration option.';
                        examples: ['log-level'];
                        type: 'string';
                        minLength: 2;
                        maxLength: 30;
                        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$';
                    };
                    name: {
                        title: 'Name';
                        description: 'The name of the configuration option.';
                        examples: ['Log level'];
                        $ref: '#/$defs/localizedString';
                        additionalProperties: {
                            minLength: 2;
                            maxLength: 30;
                        };
                    };
                    description: {
                        title: 'Description';
                        description: 'A description of the configuration option.';
                        examples: [
                            'The log level of the app. Can be set to `info`, `warn` or `error`.'
                        ];
                        $ref: '#/$defs/localizedString';
                        additionalProperties: {
                            minLength: 2;
                            maxLength: 1000;
                        };
                    };
                    type: {
                        title: 'Type';
                        description: 'The type of the configuration option.';
                        examples: ['select'];
                        type: 'string';
                        enum: [
                            'string',
                            'boolean',
                            'number',
                            'select',
                            'range',
                            'color',
                            'date',
                            'datetime',
                            'email',
                            'month',
                            'password',
                            'telephone',
                            'time',
                            'url',
                            'week'
                        ];
                    };
                    environmentVariable: {
                        title: 'Environment variable';
                        description: 'The environment variable that is being set by the configuration option. Should be in uppercase and snake case. Example: `MY_ENVIRONMENT_VARIABLE`.';
                        examples: ['LOG_LEVEL'];
                        type: 'string';
                    };
                    required: {
                        title: 'Required';
                        description: 'Whether the configuration option is required.';
                        default: false;
                        type: 'boolean';
                    };
                    default: {
                        title: 'Default';
                        description: 'The default value of the configuration option. This is mandatory if the `required` property is set to `false`.';
                        examples: ['info'];
                        type: 'string';
                    };
                    selectOptions: {
                        title: 'Select options';
                        description: 'The possible options of an select field. Only required if the type is `select`.';
                        type: 'array';
                        items: {
                            examples: ['info', 'warn', 'error'];
                            type: 'string';
                        };
                        minItems: 2;
                    };
                    rangeOptions: {
                        title: 'Range options';
                        description: 'The options of a range field. Only required if the type is `range`.';
                        type: 'object';
                        properties: {
                            min: {
                                title: 'Minimum';
                                description: 'The minimum value of the range.';
                                default: 0;
                                type: 'number';
                            };
                            max: {
                                title: 'Maximum';
                                description: 'The maximum value of the range.';
                                default: 100;
                                type: 'number';
                            };
                            step: {
                                title: 'Step';
                                description: 'The step value of the range.';
                                default: 1;
                                type: 'number';
                                minimum: 0.01;
                            };
                        };
                        additionalProperties: false;
                    };
                    validation: {
                        title: 'Validation';
                        description: 'The regex pattern that the value of the configuration option has to match.';
                        examples: ['^[a-z0-9]+(?:-[a-z0-9]+)*$'];
                        type: 'string';
                        format: 'regex';
                    };
                    validationScript: {
                        title: 'Validation script';
                        description: 'The validation script of the configuration option. The script should return a boolean value.';
                        examples: ['myValidationScript.js'];
                        type: 'string';
                        format: 'uri-reference';
                    };
                };
                additionalProperties: false;
                required: ['id', 'name', 'description', 'type', 'environmentVariable'];
                allOf: [
                    {
                        if: {
                            properties: {
                                required: {
                                    const: false;
                                };
                            };
                        };
                        then: {
                            required: ['default'];
                        };
                    },
                    {
                        if: {
                            properties: {
                                type: {
                                    const: 'select';
                                };
                            };
                        };
                        then: {
                            required: ['selectOptions'];
                        };
                    }
                ];
            };
        };
        http: {
            title: 'HTTP';
            description: 'The http ports and their corresponding subdomains of the app.';
            type: 'array';
            items: {
                $ref: '#/$defs/network';
                properties: {
                    subdomain: {
                        title: 'Subdomain';
                        description: 'The subdomain of the app.';
                        examples: ['myapp'];
                        type: 'string';
                        minLength: 2;
                        maxLength: 30;
                    };
                };
                unevaluatedProperties: false;
                required: ['subdomain'];
            };
        };
        udp: {
            title: 'UDP';
            description: 'The udp ports of the app.';
            type: 'array';
            items: {
                $ref: '#/$defs/network';
                unevaluatedProperties: false;
            };
        };
        tcp: {
            title: 'TCP';
            description: 'The tcp ports of the app.';
            type: 'array';
            items: {
                $ref: '#/$defs/network';
                unevaluatedProperties: false;
            };
        };
        messages: {
            title: 'Messages';
            description: 'Messages that are being send by specific events as notifications.';
            type: 'object';
            properties: {
                postInstall: {
                    title: 'Post install';
                    description: 'The notification that is being send after the app has been installed.';
                    examples: ["Use the username 'demo' and the password 'demo' to login."];
                    $ref: '#/$defs/localizedString';
                    additionalProperties: {
                        minLength: 2;
                        maxLength: 1000;
                    };
                };
            };
            additionalProperties: false;
        };
    };
    additionalProperties: false;
    required: [
        'uuid',
        'name',
        'description',
        'icon',
        'links',
        'publishedAt',
        'developer',
        'category'
    ];
    oneOf: [
        {
            required: ['http'];
        },
        {
            required: ['udp'];
        },
        {
            required: ['tcp'];
        }
    ];
    $defs: {
        localizedString: {
            title: 'Localized string';
            description: 'A string that is localized in different languages.';
            type: 'object';
            properties: {
                en: {
                    type: 'string';
                };
            };
            propertyNames: {
                enum: ['en', 'de'];
            };
            additionalProperties: {
                type: 'string';
            };
            required: ['en'];
        };
        network: {
            type: 'object';
            properties: {
                port: {
                    title: 'Port';
                    description: 'The port to be exposed.';
                    examples: [12345];
                    type: 'integer';
                    minimum: 0;
                    maximum: 65535;
                };
                description: {
                    title: 'Description';
                    description: 'A description of the network.';
                    examples: ['The port for clients to connect to.'];
                    $ref: '#/$defs/localizedString';
                    additionalProperties: {
                        minLength: 2;
                        maxLength: 1000;
                    };
                };
            };
            required: ['port', 'description'];
        };
    };
};

export type AppConfiguration = FromSchema<typeof appSchema>;

const test: AppConfiguration = {
    uuid: '018e2df9-aa80-771c-98ba-0f2e68a302ab',
    name: {
        en: 'My App',
        de: 'Meine App'
    },
    description: {
        en: 'My App is a great app that does great things. It is useful because it does great things. It is great.',
        de: 'Meine App ist eine großartige App, die großartige Dinge tut. Sie ist nützlich, weil sie großartige Dinge tut. Sie ist großartig.'
    },
    icon: 'icon.svg',
    banner: 'banner.png',
    screenshots: ['screenshot1.png', 'screenshot2.png'],
    links: {
        repository: 'https://github.com/example/example',
        website: 'https://example.com',
        custom: [
            {
                name: {
                    en: 'Documentation',
                    de: 'Dokumentation'
                },
                url: 'https://example.com/documentation'
            }
        ]
    },
    publishedAt: '2024-03-11T15:48:54Z',
    developer: 'John Doe',
    category: 'productivity',
    license: 'Apache-2.0',
    config: [
        {
            id: 'log-level',
            name: {
                en: 'Log level',
                de: 'Log-Level'
            },
            description: {
                en: 'The log level of the app. Can be set to `info`, `warn` or `error`.',
                de: 'Der Log-Level der App. Kann auf `info`, `warn` oder `error` gesetzt werden.'
            },
            type: 'select',
            environmentVariable: 'LOG_LEVEL',
            required: false,
            default: 'info',
            selectOptions: ['info', 'warn', 'error']
        }
    ],
    http: [
        {
            port: 12345,
            description: {
                en: 'The port for clients to connect to.',
                de: 'Der Port, an den sich die Clients verbinden.'
            },
            subdomain: 'myapp'
        }
    ],
    messages: {
        postInstall: {
            en: "Use the username 'demo' and the password 'demo' to login.",
            de: "Benutze den Benutzernamen 'demo' und das Passwort 'demo', um dich einzuloggen."
        }
    }
};

console.log(test);
