// tailwind.config.js

module.exports = {
    purge: ['./src/**/*.html', './src/**/*.css', './src/**/*.scss', './src/**/*.js', './src/**/*.jsx'],
    darkMode: false,
    theme: {
        colors: {
            transparent: 'transparent',
            black: '#000',
            white: '#fff',
            light: '#F7f8f9',
            dark: '#181818',
            sun: '#E7AB4D',
            react: '#2acef7',
            heart: '#ed2324',
            toggle: '#ffa500',
            gray: {
                100: '#f7fafc',
                200: '#edf2f7',
                300: '#e2e8f0',
                400: '#cbd5e0',
                500: '#a0aec0',
                600: '#718096',
                700: '#4a5568',
                800: '#2d3748',
                900: '#1a202c',
            },
            red: {
                0: '#f44336',
                50: '#ffebee',
                100: '#ffcdd2',
                200: '#ef9a9a',
                300: '#e57373',
                400: '#ef5350',
                500: '#f44336',
                600: '#e53935',
                700: '#d32f2f',
                800: '#c62828',
                900: '#b71c1c',
                '100-accent': '#ff8a80',
                '200-accent': '#ff5252',
                '400-accent': '#ff1744',
                '700-accent': '#d50000',
            },
            pink: {
                '0': '#e91e63',
                '50': '#fce4ec',
                '100': '#f8bbd0',
                '200': '#f48fb1',
                '300': '#f06292',
                '400': '#ec407a',
                '500': '#e91e63',
                '600': '#d81b60',
                '700': '#c2185b',
                '800': '#ad1457',
                '900': '#880e4f',
                '100-accent': '#ff80ab',
                '200-accent': '#ff4081',
                '400-accent': '#f50057',
                '700-accent': '#c51162',
            },
            purple: {
                '0': '#9c27b0',
                '50': '#f3e5f5',
                '100': '#e1bee7',
                '200': '#ce93d8',
                '300': '#ba68c8',
                '400': '#ab47bc',
                '500': '#9c27b0',
                '600': '#8e24aa',
                '700': '#7b1fa2',
                '800': '#6a1b9a',
                '900': '#4a148c',
                '100-accent': '#ea80fc',
                '200-accent': '#e040fb',
                '400-accent': '#d500f9',
                '700-accent': '#aa00ff',
            },
            'deep-purple': {
                '0': '#673ab7',
                '50': '#ede7f6',
                '100': '#d1c4e9',
                '200': '#b39ddb',
                '300': '#9575cd',
                '400': '#7e57c2',
                '500': '#673ab7',
                '600': '#5e35b1',
                '700': '#512da8',
                '800': '#4527a0',
                '900': '#311b92',
                '100-accent': '#b388ff',
                '200-accent': '#7c4dff',
                '400-accent': '#651fff',
                '700-accent': '#6200ea',
            },
            indigo: {
                '0': '#3f51b5',
                '50': '#e8eaf6',
                '100': '#c5cae9',
                '200': '#9fa8da',
                '300': '#7986cb',
                '400': '#5c6bc0',
                '500': '#3f51b5',
                '600': '#3949ab',
                '700': '#303f9f',
                '800': '#283593',
                '900': '#1a237e',
                '100-accent': '#8c9eff',
                '200-accent': '#536dfe',
                '400-accent': '#3d5afe',
                '700-accent': '#304ffe',
            },
            blue: {
                '0': '#2196f3',
                '50': '#e3f2fd',
                '100': '#bbdefb',
                '200': '#90caf9',
                '300': '#64b5f6',
                '400': '#42a5f5',
                '500': '#2196f3',
                '600': '#1e88e5',
                '700': '#1976d2',
                '800': '#1565c0',
                '900': '#0d47a1',
                '100-accent': '#82b1ff',
                '200-accent': '#448aff',
                '400-accent': '#2979ff',
                '700-accent': '#2962ff',
            },
            'light-blue': {
                '0': '#03a9f4',
                '50': '#e1f5fe',
                '100': '#b3e5fc',
                '200': '#81d4fa',
                '300': '#4fc3f7',
                '400': '#29b6f6',
                '500': '#03a9f4',
                '600': '#039be5',
                '700': '#0288d1',
                '800': '#0277bd',
                '900': '#01579b',
                '100-accent': '#80d8ff',
                '200-accent': '#40c4ff',
                '400-accent': '#00b0ff',
                '700-accent': '#0091ea',
            },
            cyan: {
                '0': '#00bcd4',
                '50': '#e0f7fa',
                '100': '#b2ebf2',
                '200': '#80deea',
                '300': '#4dd0e1',
                '400': '#26c6da',
                '500': '#00bcd4',
                '600': '#00acc1',
                '700': '#0097a7',
                '800': '#00838f',
                '900': '#006064',
                '100-accent': '#84ffff',
                '200-accent': '#18ffff',
                '400-accent': '#00e5ff',
                '700-accent': '#00b8d4',
            },
            teal: {
                '0': '#009688',
                '50': '#e0f2f1',
                '100': '#b2dfdb',
                '200': '#80cbc4',
                '300': '#4db6ac',
                '400': '#26a69a',
                '500': '#009688',
                '600': '#00897b',
                '700': '#00796b',
                '800': '#00695c',
                '900': '#004d40',
                '100-accent': '#a7ffeb',
                '200-accent': '#64ffda',
                '400-accent': '#1de9b6',
                '700-accent': '#00bfa5',
            },
            green: {
                '0': '#4caf50',
                '50': '#e8f5e9',
                '100': '#c8e6c9',
                '200': '#a5d6a7',
                '300': '#81c784',
                '400': '#66bb6a',
                '500': '#4caf50',
                '600': '#43a047',
                '700': '#388e3c',
                '800': '#2e7d32',
                '900': '#1b5e20',
                '100-accent': '#b9f6ca',
                '200-accent': '#69f0ae',
                '400-accent': '#00e676',
                '700-accent': '#00c853',
            },
            'light-green': {
                '0': '#8bc34a',
                '50': '#f1f8e9',
                '100': '#dcedc8',
                '200': '#c5e1a5',
                '300': '#aed581',
                '400': '#9ccc65',
                '500': '#8bc34a',
                '600': '#7cb342',
                '700': '#689f38',
                '800': '#558b2f',
                '900': '#33691e',
                '100-accent': '#ccff90',
                '200-accent': '#b2ff59',
                '400-accent': '#76ff03',
                '700-accent': '#64dd17',
            },
            lime: {
                '0': '#cddc39',
                '50': '#f9fbe7',
                '100': '#f0f4c3',
                '200': '#e6ee9c',
                '300': '#dce775',
                '400': '#d4e157',
                '500': '#cddc39',
                '600': '#c0ca33',
                '700': '#afb42b',
                '800': '#9e9d24',
                '900': '#827717',
                '100-accent': '#f4ff81',
                '200-accent': '#eeff41',
                '400-accent': '#c6ff00',
                '700-accent': '#aeea00',
            },
            yellow: {
                '0': '#ffeb3b',
                '50': '#fffde7',
                '100': '#fff9c4',
                '200': '#fff59d',
                '300': '#fff176',
                '400': '#ffee58',
                '500': '#ffeb3b',
                '600': '#fdd835',
                '700': '#fbc02d',
                '800': '#f9a825',
                '900': '#f57f17',
                '100-accent': '#ffff8d',
                '200-accent': '#ffff00',
                '400-accent': '#ffea00',
                '700-accent': '#ffd600',
            },
            amber: {
                '0': '#ffc107',
                '50': '#fff8e1',
                '100': '#ffecb3',
                '200': '#ffe082',
                '300': '#ffd54f',
                '400': '#ffca28',
                '500': '#ffc107',
                '600': '#ffb300',
                '700': '#ffa000',
                '800': '#ff8f00',
                '900': '#ff6f00',
                '100-accent': '#ffe57f',
                '200-accent': '#ffd740',
                '400-accent': '#ffc400',
                '700-accent': '#ffab00',
            },
            orange: {
                '0': '#ff9800',
                '50': '#fff3e0',
                '100': '#ffe0b2',
                '200': '#ffcc80',
                '300': '#ffb74d',
                '400': '#ffa726',
                '500': '#ff9800',
                '600': '#fb8c00',
                '700': '#f57c00',
                '800': '#ef6c00',
                '900': '#e65100',
                '100-accent': '#ffd180',
                '200-accent': '#ffab40',
                '400-accent': '#ff9100',
                '700-accent': '#ff6d00',
            },
            'deep-orange': {
                '0': '#ff5722',
                '50': '#fbe9e7',
                '100': '#ffccbc',
                '200': '#ffab91',
                '300': '#ff8a65',
                '400': '#ff7043',
                '500': '#ff5722',
                '600': '#f4511e',
                '700': '#e64a19',
                '800': '#d84315',
                '900': '#bf360c',
                '100-accent': '#ff9e80',
                '200-accent': '#ff6e40',
                '400-accent': '#ff3d00',
                '700-accent': '#dd2c00',
            },
            brown: {
                '0': '#795548',
                '50': '#efebe9',
                '100': '#d7ccc8',
                '200': '#bcaaa4',
                '300': '#a1887f',
                '400': '#8d6e63',
                '500': '#795548',
                '600': '#6d4c41',
                '700': '#5d4037',
                '800': '#4e342e',
                '900': '#3e2723',
            },
            grey: {
                '0': '#9e9e9e',
                '50': '#fafafa',
                '100': '#f5f5f5',
                '200': '#eeeeee',
                '300': '#e0e0e0',
                '400': '#bdbdbd',
                '500': '#9e9e9e',
                '600': '#757575',
                '700': '#616161',
                '800': '#424242',
                '900': '#212121',
            },
            'blue-gray': {
                '0': '#607d8b',
                '50': '#eceff1',
                '100': '#cfd8dc',
                '200': '#b0bec5',
                '300': '#90a4ae',
                '400': '#78909c',
                '500': '#607d8b',
                '600': '#546e7a',
                '700': '#455a64',
                '800': '#37474f',
                '900': '#263238',
            },
        },
        borderRadius: {
            none: '0',
            sm: '0.125rem',
            default: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            full: '2rem',
        },
        fontFamily: {
            sans: [
                '-apple-system',
                'BlinkMacSystemFont',
                'SpaceGrotesk',
                'Lato',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji',
            ],
            serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            mono: [
                'Menlo',
                'Monaco',
                'Consolas',
                'Liberation Mono',
                'Courier New',
                'monospace',
            ],
        },
        animation: {
            fadeOut: 'fadeOut 2s ease-in-out',
        },

        keyframes: theme => ({
            fadeOut: {
                '0%': {
                    opacity: 1,
                },
                '100%': {
                    opacity: 0,
                },
            },
        }),
    },
}
