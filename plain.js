(function(d, script) {
    script = d.createElement('script');
    script.async = false;
    script.onload = function (){
        Plain.init({
            appId: 'liveChatApp_01JDPPAPQS2V6A8FH59N33PHDY',
            links: [
                {
                    icon: 'book',
                    text: 'View our docs',
                    url: 'https://nova.laravel.com/docs',
                }, {
                    icon: 'discord',
                    text: 'Join our Discord',
                    url: 'https://discord.com/invite/laravel',
                }
            ],
            style: {
                brandColor: '#00E1FF',
                chatButtonColor: '#00E1FF',
                chatButtonIconColor: '#ffffff',
            },
            threadDetails: {
                labelTypeIds: ['lt_01JAZTMNYM3EQVS854CK6JKAA9'],
            },
            theme: 'auto',
            position: {
                right: '25px',
                bottom: '25px',
            },
            requireAuthentication: true,
            chatButtons: [
                {
                    icon: 'chat',
                    text: 'Ask a question',
                    threadDetails: {
                        labelTypeIds: ['lt_01JD7S0WAJGF5215238S62F82V'],
                    },
                },
                {
                    icon: 'bulb',
                    text: 'Send feedback',
                    threadDetails: {
                        labelTypeIds: ['lt_01JD7S1HJ38125D0QGE3FQ8HRT'],
                    },
                },
                {
                    icon: 'error',
                    text: 'Report an issue',
                    threadDetails: {
                        labelTypeIds: ['lt_01JD7S15A3HAD7PM8X8AR4BD9N'],
                    },
                },
            ],
        });
    };
    script.src = 'https://chat.cdn-plain.com/index.js';
    d.getElementsByTagName('head')[0].appendChild(script);

    document.querySelector("#navbar ul a[href='mailto:nova@laravel.com']").onclick = function (e) {
        if (typeof window.Plain !== 'undefined') {
            e.preventDefault();
            Plain.open()
        }
    }
}(document));
