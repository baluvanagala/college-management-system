from django.core.management.base import BaseCommand
from ...models import Student, Fee
from datetime import date

class Command(BaseCommand):
    help = "Create default fee records for all students across multiple academic years"

    def handle(self, *args, **kwargs):
        academic_years = ["2023-2024", "2024-2025", "2025-2026"]  # ✅ add all years you want
        count = 0

        for student in Student.objects.all():
            for year in academic_years:
                fee, created = Fee.objects.get_or_create(
                    student=student,
                    academic_year=year,
                    due_date=date(2025, 6, 30),   # you can adjust per year
                    defaults={
                        "total_fee": 50000,
                        "paid_amount": 0,
                        "status": "unpaid"
                    }
                )
                if created:
                    count += 1

        self.stdout.write(self.style.SUCCESS(f"Default fees created: {count} records"))
