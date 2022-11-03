import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  media = [
    {
      key: "linkedin",
      link: "https://www.linkedin.com/in/c%C4%83t%C4%83lin-latcovschi-28372220b/"
    },
    {
      key: "github",
      link: "https://github.com/catalin572"
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
