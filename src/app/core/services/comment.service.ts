import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, catchError, of } from 'rxjs';
import { Comment } from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getComments(trackId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comments/${trackId}`).pipe(
      catchError(err => {
        console.error('Error fetching comments', err);
        return of([]);
      })
    );
  }

  addComment(trackId: string, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments/${trackId}`, { text });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`);
  }
}
