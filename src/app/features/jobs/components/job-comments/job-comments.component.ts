import { Component, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UtcDateTimePipe } from '../../../../shared/utils/date.pipes';
import { injectUsers } from '../../../users/data/users.queries';
import { injectAddJobCommentMutation } from '../../data/jobs.mutations';
import { injectJobComments } from '../../data/jobs.queries';

@Component({
  selector: 'app-job-comments',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, UtcDateTimePipe],
  templateUrl: './job-comments.component.html',
})
export class JobCommentsComponent {
  readonly jobId = input.required<string>();

  readonly draft = signal('');
  readonly usersQuery = injectUsers();
  readonly commentsQuery = injectJobComments(this.jobId);
  readonly addComment = injectAddJobCommentMutation(this.jobId);

  authorName(authorId: string): string {
    return this.usersQuery.data()?.find((u) => u.id === authorId)?.fullName ?? 'Unknown';
  }

  submit(): void {
    const body = this.draft().trim();
    if (!body) return;
    this.addComment.mutate(body, {
      onSuccess: () => this.draft.set(''),
    });
  }
}
