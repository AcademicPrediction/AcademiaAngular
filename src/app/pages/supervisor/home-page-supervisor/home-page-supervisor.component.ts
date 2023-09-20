import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import * as XLSX from 'xlsx';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  PieController,
  ArcElement,
  ChartTypeRegistry,
  LineController,
  PointElement,
  LineElement,
} from 'chart.js';
import { PredictionService } from 'src/app/service/prediction.service';
import { Supervisor } from 'src/app/model/supervisor';

@Component({
  selector: 'app-home-page-supervisor',
  templateUrl: './home-page-supervisor.component.html',
  styleUrls: ['./home-page-supervisor.component.css'],
})
export class HomePageSupervisorComponent {
  supervisor: Supervisor | null = null;
  existPrediction = false;
  isLoading = true;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart?: Chart<keyof ChartTypeRegistry, any[], any>;

  constructor(private predictionService: PredictionService) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
    );
  }

  ngOnInit(): void {
    this.supervisor = JSON.parse(
      localStorage.getItem('supervisor') || '{}',
    ) as Supervisor;

    this.predictionService.donwloadLastPrediction(this.supervisor.id).subscribe(
      (response: any) => {
        const blob: Blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const data: string = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          this.initChart(jsonData);
        };

        reader.readAsBinaryString(blob);

        this.existPrediction = true;
        this.isLoading = false;
      },
      (error) => {
        this.existPrediction = false;
        this.isLoading = false;
        console.error('Error al obtener la última predicción:', error);
      },
    );
  }

  initChart(data: any[]): void {
    const courses: { [key: string]: any } = {};

    data.forEach((student: any) => {
      Object.keys(student).forEach((course) => {
        if (course === 'Alumno') return;

        // Elimina la palabra 'predicted' de cada curso.
        const cleanCourse = course.replace(' Predicted', '');

        if (!courses[cleanCourse]) courses[cleanCourse] = { good: 0, bad: 0 };

        if (student[course] > 11) {
          courses[cleanCourse].good += 1;
        } else {
          courses[cleanCourse].bad += 1;
        }
      });
    });

    const labels = Object.keys(courses).map((label) =>
      label.replace(' predicted', ''),
    );
    const goodScores = labels.map((label) => courses[label].good);
    const badScores = labels.map((label) => courses[label].bad);

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Buen rendimiento',
            data: goodScores,
            backgroundColor: 'lightgreen',
            borderColor: 'green',
            borderWidth: 1,
          },
          {
            label: 'Mal rendimiento',
            data: badScores,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Cursos' } },
          y: {
            title: { display: true, text: 'Número de Estudiantes' },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true, // para mostrar la leyenda
            position: 'top', // puedes cambiar la posición ('top', 'left', 'bottom', 'right')
            labels: {
              boxWidth: 50,
              padding: 10,
            },
          },
        },
      },
    });
  }
}
