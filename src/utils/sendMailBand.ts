import mailTransporter from "./mailTransporter";

export default async (
    email: string,
    pass: string,
    name: string,
    from: string,
    to: string,
    codec: string,
    advertiser: string,
    broadcaster: string,
    infos: emailFormat.emailPropsBand
) => {

    let mediaInfos = "";
    let template = "";

    for (const i in infos.mediaInfos) {
        if(!infos.mediaInfos[i].clock || !infos.mediaInfos[i].duration || !infos.mediaInfos[i].title)
            throw new Error("Preencha todos os campos para enviar os materiais aos destinos.");

        let correctCodecLink;


        if(codec === "mxf") correctCodecLink = infos.mediaInfos[i].linkMxf;
        if(codec === "mov") correctCodecLink = infos.mediaInfos[i].linkMov;
        if(codec === "mp4") correctCodecLink = infos.mediaInfos[i].linkMp4;

        mediaInfos += `
        <table>
            <tr class="tittle">
                <td>Destino</td>
                <td>Clock Number</td>
                <td>Duração</td>
                <td>Titulo</td>
                <td>Link</td>
            </tr>
            <tr class="infos">
                <td>${broadcaster}</td>
                <td>${infos.mediaInfos[i].clock}</td>
                <td>${infos.mediaInfos[i].duration}</td>
                <td>${infos.mediaInfos[i].title}</td>
                <td><a href="${correctCodecLink}">DOWNLOAD</a></td>
            </tr>
        </table>
        <br>
        <br>
        `;
    }

    if(mediaInfos !== "") {
        template = `
            Olá, tudo bem?
            <br>
                <br>
            Segue abaixo a entrega do material do anunciante ${advertiser}:
            <br>
            <br>
            ${mediaInfos}

            Favor confirmar o recebimento.
            <br>
            <br>
            `;
    }

    if(mediaInfos !== "") await mailTransporter(email, pass).sendMail({
        from: from,
        to: to,
        cc: "trafego@extremereach.com",
        subject: `Entrega de material - ${advertiser} - ${broadcaster}`,
        html: `
        <head>
            <style>
    * {
        font-size: 14px;
    }

    body {
        background-color: black;
    }

    table {
        display: flex;
        flex-wrap: wrap;
        font-family: sans-serif;
        text-align: center;
    }

    td, table {
        border-collapse: collapse;
        width: 750px;
    }

    td {
        border: 1px solid white;
    }

    .tittle {
        height: 20px;
        background-color: #77aadd;
        font-weight: bold;
    }

    .infos {
        background-color: #cccccc;
    }

    a {
        text-decoration: none;
        color: #2074c9;
    }

</style>
  </head>
  <body>
  ${template}
    <br>
    <br>
    <p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 18pt; font-family: 'Times New Roman', serif; color: rgb(0, 0, 0); text-decoration-line: none; vertical-align: baseline; white-space: pre-wrap;"><span style="font-size: 11pt;">Abs,</span></span></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 18pt; font-family: 'Times New Roman', serif; color: rgb(0, 0, 0); text-decoration-line: none; vertical-align: baseline; white-space: pre-wrap;">${name}</span></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 9pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); text-decoration-line: none; vertical-align: baseline; white-space: pre-wrap;">Traffic Assitent</span></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); font-weight: bold; vertical-align: baseline; white-space: pre-wrap;">M:</span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"> 55 11 98892-5295</span></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"><span style="text-decoration-line: underline;"><strong>Manter sempre o e-mail do <a style="color: rgb(17, 85, 204);" href="mailto:trafego@extremereach.com" target="_blank" rel="noopener">trafego@extremereach.com</a></strong></span><br></span></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><a style="color: rgb(17, 85, 204); text-decoration-line: none;" href="https://xr.global/" target="_blank" rel="noopener" data-saferedirecturl="https://www.google.com/url?q=https://xr.global/&amp;source=gmail&amp;ust=1705597196781000&amp;usg=AOvVaw01AP5xIdn3bXFAGYs8vTTS"><span style="font-size: 9pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); text-decoration-line: none; vertical-align: baseline; white-space: pre-wrap;">XR.GLOBAL</span></a></p>
<p dir="ltr" style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; white-space: normal; line-height: 1.656; background-color: rgb(255, 255, 255); margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 9pt; font-family: Arial, sans-serif; color: rgb(0, 0, 0); text-decoration-line: none; vertical-align: baseline; white-space: pre-wrap;"><span style="border-style: none; display: inline-block; overflow: hidden; width: 110px; height: 23px;"><img class="CToWUd" style="margin-left: 0px; margin-top: 0px;" src="https://lh7-us.googleusercontent.com/GIeDpzFW4DCUh5Ai08PpvOtPVlvMWkFonQ-JptVgp850VXj5zMHDh68tOfrB5meJovRpQ9rUIBGlfQLxUqcc8PdC61-IFb-NE6cXp-kdU-zC50vNFlyRRBWPP_i0MJU-eyaxYBVySg1vqH4J6Pqk8Vk" width="110" height="23" crossorigin="" data-bit="iit"></span></span></p>

  </body>

        `
    });
};


