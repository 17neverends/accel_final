from pathlib import Path
from jinja2 import Template
from typing import Any, Dict
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from aiosmtplib import SMTP
from settings import settings
from utils.enums.mail_types import MailTypes


class EmailService:
    def __init__(self, template_dir: str = "email_templates"):
        self.template_dir = template_dir

    @staticmethod
    def get_mail_template(mail_type: MailTypes) -> str:
        return mail_type.value

    def render_email_template(self,
                              template_name: str,
                              context: Dict[str, Any]) -> str:
        template_str = (
            Path(__file__).parent.parent / self.template_dir / template_name
        ).read_text(encoding="utf-8")
        html_content = Template(template_str).render(context)
        return html_content

    async def send_mail(self,
                        recipient: str,
                        subject: str,
                        context: Dict[str, Any],
                        mail_type: MailTypes) -> bool:
        template_name = self.get_mail_template(mail_type)
        html_content = self.render_email_template(template_name=template_name,
                                                  context=context)

        message = MIMEMultipart()
        message["From"] = settings.smtp_user
        message["To"] = recipient
        message["Subject"] = subject
        message.attach(MIMEText(html_content, "html"))

        smtp_client = SMTP(hostname=settings.smtp_server,
                           port=settings.smtp_port,
                           use_tls=settings.use_tls)
        try:
            async with smtp_client:
                await smtp_client.login(settings.smtp_user,
                                        settings.smtp_password.get_secret_value())
                await smtp_client.send_message(message)
                return True
        except Exception as e:
            return False
