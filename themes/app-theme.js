import {definePreset} from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const Noir = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#272822',
            100: '#3e3d32',
            200: '#51514b',
            300: '#75715e',
            400: '#a59f85',
            500: '#f8f8f2',
            600: '#f92672',
            700: '#a6e22e',
            800: '#66d9ef',
            900: '#ae81ff',
            950: '#cc6633'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '#cc6633',
                    contrastColor: '#ffffff',
                    hoverColor: '#ae81ff',
                    activeColor: '#66d9ef'
                },
                highlight: {
                    background: '#cc6633',
                    focusBackground: '#66d9ef',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '#272822',
                    contrastColor: '#cc6633',
                    hoverColor: '#51514b',
                    activeColor: '#75715e'
                },
                highlight: {
                    background: '#272822',
                    focusBackground: '#75715e',
                    color: '#cc6633',
                    focusColor: '#cc6633'
                }
            }
        }
    }
});

export default {
    preset: Aura,
    options: {
        darkModeSelector: '.darkness'
    }
};
