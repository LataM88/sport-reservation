import os
import resend
from fastapi import HTTPException, status


resend.api_key = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "noreply@twojadomena.pl")


def send_reset_code_email(to_email: str, code: str) -> None:
    if not resend.api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Brak klucza API do wysyłania emaili",
        )

    try:
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [to_email],
            "subject": "Resetowanie hasła – kod weryfikacyjny",
            "html": _build_reset_email_html(code),
        })
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Nie udało się wysłać emaila: {str(e)}",
        )


def _build_reset_email_html(code: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="pl">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Resetowanie hasla</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend:wght@600;700&display=swap" rel="stylesheet"/>
    </head>
    <body style="margin:0;padding:0;background-color:#010101;font-family:'Inter',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#010101;padding:48px 20px;">
            <tr>
                <td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" border="0"
                           style="background-color:#010101;border-radius:12px;
                                  border:1px solid #464646;overflow:hidden;">

                        <!-- Header bar -->
                        <tr>
                            <td style="background-color:#125050;padding:28px 40px 24px;">
                                <p style="margin:0;font-family:'Lexend',sans-serif;font-size:11px;
                                          font-weight:600;letter-spacing:3px;text-transform:uppercase;
                                          color:#a2ff00;">
                                    Sport Reservation
                                </p>
                                <h1 style="margin:8px 0 0;font-family:'Lexend',sans-serif;
                                           font-size:26px;font-weight:700;color:#ffffff;
                                           letter-spacing:-0.5px;">
                                    Resetowanie hasla
                                </h1>
                            </td>
                        </tr>

                        <!-- Divider line -->
                        <tr>
                            <td style="height:2px;background:linear-gradient(90deg,#a2ff00,#00e5ff,#125050);
                                       font-size:0;line-height:0;">&nbsp;</td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:36px 40px 28px;">
                                <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#ffffff;">
                                    Otrzymalismy prosbe o reset hasla dla Twojego konta.
                                </p>
                                <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#464646;">
                                    Uzyj ponizszego kodu jednorazowego, aby ustawic nowe haslo.
                                    Nie udostepniaj go nikomu.
                                </p>

                                <!-- Code block -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center" style="padding:0 0 28px;">
                                            <table cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td style="background-color:#010101;
                                                                border:1px solid #a2ff00;
                                                                border-radius:8px;
                                                                padding:20px 48px;
                                                                text-align:center;">
                                                        <p style="margin:0 0 4px;font-size:11px;
                                                                  letter-spacing:2px;text-transform:uppercase;
                                                                  color:#464646;font-weight:500;">
                                                            Twoj kod
                                                        </p>
                                                        <span style="font-family:'Courier New',Consolas,monospace;
                                                                     font-size:42px;font-weight:700;
                                                                     letter-spacing:14px;color:#a2ff00;
                                                                     display:block;line-height:1.2;">
                                                            {code}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Expiry notice -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td style="background-color:#125050;border-radius:6px;
                                                   padding:14px 20px;">
                                            <p style="margin:0;font-size:13px;color:#00e5ff;font-weight:500;">
                                                Kod jest wazny przez
                                                <strong style="color:#ffffff;">15 minut</strong>
                                                od momentu wysania tej wiadomosci.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin:28px 0 0;font-size:13px;line-height:1.7;color:#464646;">
                                    Jesli nie prosilas/es o reset hasla, mozesz bezpiecznie zignorowac
                                    te wiadomosc. Twoje konto pozostaje bez zmian.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="border-top:1px solid #464646;padding:20px 40px;
                                       background-color:#010101;">
                                <p style="margin:0;font-size:12px;color:#464646;text-align:center;">
                                    Sport Reservation &copy; 2024 &nbsp;&middot;&nbsp;
                                    Ta wiadomosc zostala wygenerowana automatycznie
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
